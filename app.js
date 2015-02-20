var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var simpledb = require('mongoose-simpledb');
var passport = require('passport');

// Initialize the database and then the application.
var db = simpledb.init(
  process.env.CONNECTION_STRING || 'mongodb://pawproject:4thepaws@ds052827.mongolab.com:52827/pp-dev',
  function (err, db) {
    if (err) return console.error(err);
    // TODO: Initialize the database with seed data if it doesn't exist.
  }
);

var app = express();

var routes = {
  api: require('./routes/api'),
  auth: require('./routes/auth'),
  pages: require('./routes/pages')
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon-paw.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
  if (req.param('redirectUrl'))
    req.session.redirectUrl = req.param('redirectUrl');
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
app.use('/auth', routes.auth);
app.use('/api', routes.api);
app.use('/', routes.pages);

// Bootstrap CSS redirects.
app.get('/fonts/:item', function (req, res) {
  res.redirect('/bower_components/bootstrap/dist/fonts/' + req.param('item'));
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var requestUrl = req.url.replace(/\/+$/g, "");
  db.LegacyRedirect.findOne({ url: requestUrl }, function (err, lr) {
    if (err) return next(err);
    // If a legacy redirect does not yet exist for the request URL, create one.
    if (!lr) {
      lr = new db.LegacyRedirect({
        url: requestUrl,
        should404: false,
        redirectUrl: 'http://www1.pawproject.org' + requestUrl,
        count: 0,
        triggered: []
      });
    }
    // Check if legacy redirect is supposed to send a 404.
    // If so, send a 404 response and don't bother updating the legacy redirect.
    if (lr.should404) {
      var err = new Error(lr.url + ' Could Not Be Found');
      err.status = 404;
      next(err);
    } else {
      // Update legacy redirect count and add information about the current request.
      lr.count++;
      lr.triggered.push({
        date: Date.now(),
        ip: req.ip,
        referrer: req.get('referrer')
      });
      // Save legacy redirect.
      lr.save(function (err) {
        if (err) next(err);
        //res.redirect(lr.redirectUrl);
        res.render('redirect', {
          redirectUrl: lr.redirectUrl
        });
      });
    }
  });
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
