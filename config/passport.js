const LocalStrategy = require('passport-local').Strategy;
const dbConfig = require('../config/db');
const db = dbConfig.db;
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, username, inPassword, done) => {
        const userDoc = await db.doc(`admin/${username}`).get();
        if(!userDoc.exists) return done(null, false, req.flash('loginMessage', 'El usuario no existe.'));
        if(userDoc.data().password !== inPassword) return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.'));
        done(null, true);
    }));
};