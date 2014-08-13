var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var simpledb = require('mongoose-simpledb');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

simpledb.init(process.env.CONNECTION_STRING || 'mongodb://localhost/pawproject', function (err, db) {
  if (err) return console.error(err);

  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID || '319527944881597',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '16116728519e48da772b1be398b6cb38',
      callbackURL: "http://localhost:1337/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      db.User.findOne({ facebookId: profile.id }, function(err, user) {
        if (err) { return done(err); }
        done(null, user);
      });
    }
  ));

});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/pages'));

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
