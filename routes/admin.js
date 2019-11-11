module.exports = (app, passport) => {
    app.get('/login', (req, res) => {
        console.log(req.flash('loginMessage')[0]);
        res.render('login', {loginMessage: req.flash('loginMessage')});
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));
};