var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var simpledb = require('mongoose-simpledb');
var passport = require('passport');

// Initialize the database and then the application.
var db = simpledb.init(process.env.CONNECTION_STRING || 'mongodb://localhost/pawproject');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || '5up3r133753cr3t',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  app.locals.user = req.user;
  app.locals.currentUrl = req.url;
  if (req.param('redirect'))
    req.session.redirectUrl = req.param('redirect');
  else if (!req.session.redirectUrl)
    req.session.redirectUrl = '/';
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// TODO: REMOVE THIS FOR PRODUCTION
app.get('/session', function (req, res) {
  res.send(req.session);
});

// Page endpoints.
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/pages'));

// Bootstrap CSS redirects.
app.get('/fonts/:item', function (req, res) {
  res.redirect('/bower_components/bootstrap/dist/fonts/' + req.param('item'));
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
