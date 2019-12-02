const dbConfig = require('../config/db');
const db = dbConfig.db;
const moment = require('moment');
const booksListRef = db.doc('books/booksList');
db.doc('loans/145844').set({
    dueList: [
        {
            author: 'autor',
            borrowed_on: '21-11-2019',
            edition: 'edicion',
            editorial: 'editorial',
            expires_on: '11-11-2019',
            title: 'tituloo'
        },
        {
            author: 'autor2',
            borrowed_on: '21-11-2019',
            edition: 'edicio2n',
            editorial: 'editorial2',
            expires_on: '01-12-2019',
            title: 'tituloo2'
        },
        {
            author: 'autor2',
            borrowed_on: '21-11-2019',
            edition: 'edicio2n',
            editorial: 'editorial2',
            expires_on: '03-12-2019',
            title: 'tituloo3'
        },
    ]
});
module.exports = (app) => {
    //Libros
    app.get('/libros', async (req, res) => {
        const allBooks = await booksListRef.get();
        res.render('libros', {
            books: allBooks.data().list,
            page: 'libros'
        });
    });

    app.post('/libro', async (req, res) => {
        try {
            const response = await booksListRef.get();
            let booksArray = response.data().list;
            const bookIndex = booksArray.findIndex(book => {
                return book.title === req.body.title;
            });
            if (bookIndex !== -1) {
                return res.status(400).json({error: 'BOOK_ALREADY_EXISTS'});
            } else {
                booksArray.push({
                    title: req.body.title,
                    author: req.body.author,
                    edition: req.body.edition,
                    editorial: req.body.editorial
                });
                await db.doc('books/booksList').update({list: booksArray});
            }
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });

    app.patch('/libro', async (req, res) => {
        try {
            const response = await booksListRef.get();
            let booksArray = response.data().list;
            const bookIndex = booksArray.findIndex(book => {
                return book.title === req.body.old_title;
            });
            if (bookIndex === -1) {
                res.status(400).json({error: 'BOOK_DOESNT_EXISTS'});
            } else {
                booksArray[bookIndex].title = req.body.title;
                booksArray[bookIndex].author = req.body.author;
                booksArray[bookIndex].edition = req.body.edition;
                booksArray[bookIndex].editorial = req.body.editorial;
                await booksListRef.update({list: booksArray});
            }
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });

    app.delete('/libro', async (req, res) => {
        try {
            const response = await booksListRef.get();
            let booksArray = response.data().list;
            const bookIndex = booksArray.findIndex(book => {
                return book.title === req.body.title;
            });
            if (bookIndex === -1) {
                res.status(400).json({error: 'BOOK_DOESNT_EXISTS'});
            } else {
                const newBooksArray = booksArray.filter(book => book.title !== req.body.title);
                await booksListRef.update({list: newBooksArray});
            }
            res.status(200).send();
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });

    //Entregas
    app.get('/entregas', (req, res) => {
        res.render('entregas', {
            page: 'entregas'
        });
    });

    app.get('/pendientes', async (req, res) => {
        const loansDoc = await db.doc(`loans/${req.query.nua}`).get();
        if(!loansDoc.exists) return res.status(404).json({error: 'NUA_NOT_FOUND'});
        const due_list = loansDoc.data().dueList.map(item => {
            const itemDate = moment(item.expires_on, 'DD-MM-YYYY');
            item.expired = moment().isAfter(itemDate);
            return item;
        });
        res.status(200).json({due_list: due_list});
    });

    app.post('/entregar', async (req, res) => {
        const loanDoc = await db.doc(`loans/${req.query.nua}`).get();
        if(!loanDoc.exists) return res.status(400).json({error: 'NUA_NOT_FOUND'});
        const newLoanList = loanDoc.data().dueList.filter(item => item.title !== req.query.title);
        await db.doc(`loans/${req.query.nua}`).update({dueList: newLoanList});
        res.status(200).send();
    });

    app.post('/posponer', async (req, res) => {
        let newDate;
        const loanDoc = await db.doc(`loans/${req.query.nua}`).get();
        if(!loanDoc.exists) return res.status(400).json({error: 'NUA_NOT_FOUND'});
        const newLoanList = loanDoc.data().dueList.map(item => {
            if(item.title === req.query.title) {
                newDate = moment().add(7,'days').format('DD-MM-YYYY');
                item.expires_on = newDate;
            }
            return item;
        });
        await db.doc(`loans/${req.query.nua}`).update({dueList: newLoanList});
        res.status(200).send({new_date: newDate});
    });
};

const checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/login');
    }
};