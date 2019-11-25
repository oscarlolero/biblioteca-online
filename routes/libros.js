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
                console.log(book.name === req.body.name);
                return book.name === req.body.name;
            });
            if (bookIndex !== -1) {
                res.status(400).json({error: 'BOOK_ALREADY_EXISTS'});
            } else {
                booksArray.push({
                    name: req.body.name,
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
                return book.name === req.body.name;
            });
            if (bookIndex === -1) {
                res.status(400).json({error: 'BOOK_DOESNT_EXISTS'});
            } else {
                booksArray[bookIndex].name = req.body.name;
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
                return book.name === req.body.name;
            });
            if (bookIndex === -1) {
                res.status(400).json({error: 'BOOK_DOESNT_EXISTS'});
            } else {
                const newBooksArray = booksArray.filter(book => book.name !== req.body.name);
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