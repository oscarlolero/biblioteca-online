const dbConfig = require('../config/db');
const db = dbConfig.db;
const moment = require('moment');
const booksListRef = db.doc('books/booksList');
module.exports = (app) => {
    //Libros
    app.get('/libros', checkLogin, async (req, res) => {
        const allBooks = await booksListRef.get();
        res.render('libros', {
            books: allBooks.data().list,
            page: 'libros'
        });
    });

    app.post('/libro', checkLogin, async (req, res) => {
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

    app.patch('/libro', checkLogin, async (req, res) => {
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

    app.delete('/libro', checkLogin, async (req, res) => {
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
    app.get('/entregas', checkLogin, (req, res) => {
        res.render('entregas', {
            page: 'entregas'
        });
    });

    app.get('/pendientes', async (req, res) => {
        const loansDoc = await db.doc(`loans/${req.query.nua}`).get();
        if(!loansDoc.exists) return res.status(404).json({error: 'NUA_NOT_FOUND'});
        let due_list = loansDoc.data().dueList.map(item => {
            const itemDate = moment(item.expires_on, 'DD-MM-YYYY');
            item.expired = moment().isAfter(itemDate);
            return item;
        });
        due_list.sort((a,b) => (a.expired < b.expired) ? 1 : -1);
        res.status(200).json({due_list: due_list});
    });

    app.post('/entregar', checkLogin, async (req, res) => {
        const loanDoc = await db.doc(`loans/${req.query.nua}`).get();
        if(!loanDoc.exists) return res.status(400).json({error: 'NUA_NOT_FOUND'});
        const newLoanList = loanDoc.data().dueList.filter(item => item.title !== req.query.title);
        await db.doc(`loans/${req.query.nua}`).update({dueList: newLoanList});
        res.status(200).send();
    });

    app.post('/posponer', checkLogin, async (req, res) => {
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

    //Asignaciones
    app.get('/asignaciones', checkLogin, async (req, res) => {
        const booksDoc = await db.doc('books/booksList').get();
        res.render('asignaciones', {
            page: 'asignaciones',
            books_list: booksDoc.data().list
        });
    });

    app.get('/listalibros', checkLogin, async (req, res) => {
        const booksDoc = await db.doc('books/booksList').get();
        res.status(200).json({books_list: booksDoc.data().list});
    });

    app.post('/asignar', async (req, res) => {
        const userLoansDoc = await db.doc(`loans/${req.body.nua}`).get();
        if(!userLoansDoc.exists) return res.status(404).send();
        let newLoans = userLoansDoc.data().dueList;
        if(newLoans.findIndex(element => element.title === req.body.book_data.title) !== -1) return res.status(400).send();
        newLoans.push({
            author: req.body.book_data.author,
            edition: req.body.book_data.edition,
            editorial: req.body.book_data.editorial,
            title: req.body.book_data.title,
            borrowed_on: moment().format('DD-MM-YYYY'),
            expires_on: moment().add(7,'days').format('DD-MM-YYYY')
        });
        await db.doc(`loans/${req.body.nua}`).update({dueList: newLoans});
        res.status(200).send();
    });

};

const checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/login');
    }
};