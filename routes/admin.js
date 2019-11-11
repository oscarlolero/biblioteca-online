const dbConfig = require('../config/db');
const db = dbConfig.db;
module.exports = (app, passport) => {
    app.get('/login', (req, res) => {
        console.log(req.flash('loginMessage')[0]);
        res.render('login', {loginMessage: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/asignaciones',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/asignaciones', (req, res) => {
        res.render('asignaciones');
    });
    app.get('/estudiantes', async (req, res) => {
        const allStudents = await db.collection('students').listDocuments();
        res.render('estudiantes', allStudents.map(e => e.id));
        console.log(allStudents.map(e => e.id));
    });
};