let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'kajwg45s2',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Configuración de passport
require('./config/passport')(passport);
//Rutas
require('./routes/admin')(app, passport);
require('./routes/estudiantes')(app);
require('./routes/libros')(app);

app.use((req, res) => {
    res.redirect('/asignaciones');
});

module.exports = app;
