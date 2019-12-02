const dbConfig = require('../config/db');
const db = dbConfig.db;
const moment = require('moment');

const booksListRef = db.doc('books/booksList');
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
    // app.post('/pendientes', async (req, res) => {
    //     const loanDoc = await db.doc(`loans/${req.body.nua}`).get();
    //     if(!loanDoc.exists) return res.status(200).json({error: 'NUA_NOT_FOUND'});
    //     res.status(200).json({due_list: loanDoc.data().dueList});
    // });
    //App movil
    app.get('/pendientes', async (req, res) => {
        const loansDoc = await db.doc(`loans/${req.query.nua}`).get();
        if(!loansDoc.exists) return res.status(200).json({error: 'NUA_NOT_FOUND'});
        const due_list = loansDoc.data().dueList.map(item => {
            const itemDate = moment(item.expires_on, 'DD-MM-YYYY');
            item.expired = moment().isBefore(itemDate);
            return item;
        });
        res.status(200).json({due_list: due_list});
    });
    app.post('/entregar', async (req, res) => {
        const loanDoc = await db.doc(`loans/${req.body.nua}`).get();
        if(!loanDoc.exists) return res.status(200).json({error: 'NUA_NOT_FOUND'});
        const newLoanList = lkasjdlkaalksjd
        res.status(200).json({due_list: loanDoc.data().dueList});
    });
};

const checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/login');
    }
};