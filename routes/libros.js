const dbConfig = require('../config/db');
const db = dbConfig.db;

const booksListRef = db.doc('books/booksList');
module.exports = (app) => {
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
        console.log(req.body);
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
            console.log(req.body);
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
};

const checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/login');
    }
};