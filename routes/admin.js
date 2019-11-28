const dbConfig = require('../config/db');
const db = dbConfig.db;
module.exports = (app, passport) => {
    app.get('/login', (req, res) => {
        res.render('login', {loginMessage: req.flash('loginMessage')});
    });
    app.get('/logout', (req, res) => {
        req.logout();
        res.render('login', {loginMessage: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/asignaciones',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/entregas', (req, res) => {
        res.render('entregas', {
            page: 'entregas'
        });
    });
};
const checkLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.redirect('/login');
    }
};