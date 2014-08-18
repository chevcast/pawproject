var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var simpledb = require('mongoose-simpledb');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// Initialize the database and then the application.
var db = simpledb.init(process.env.CONNECTION_STRING || 'mongodb://localhost/pawproject');

// Setup passport serialize/deserialize functions to store just the user ID in session and restore
// the user upon each request.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(userId, done) {
  db.User.findById(userId, function(err, user) {
    done(err, user);
  });
});

// Initialize the Facebook passport strategy.
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || '319527944881597',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '16116728519e48da772b1be398b6cb38',
    callbackURL: "http://localhost:1337/auth/facebook/callback"
  },
  // This function runs when facebook authentication returns with an access token.
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    // Look in the database for a user with the facebook ID.
    db.User.findOne({ facebookId: profile.id }, function(err, user) {
      if (err) { return done(err); }
      // If there is no user returned, create one.
      if (!user) {
        user = new db.User({
          facebookId: profile.id,
          name: {
            first: profile.name.givenName,
            last: profile.name.familyName
          }
        });
        // If an email was returned from facebook, store it.
        if (profile.emails.length > 0)
          user.email = profile.emails[0].value;
      }
      // Set the user's last active date, to keep track of how often the log in.
      user.lastActive = Date.now();
      // Save the new/updated user.
      user.save(function (err, user) {
        // Done authenticating.
        done(err, user);
      });
    });
  }
));

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

// Passport endpoints.
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook'), function (req, res) {
  res.redirect(req.session.redirectUrl);
});

// Authentication endpoints.
app.get('/login', function (req, res) {
  res.send('not implemented');
});
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect(req.session.redirectUrl);
});

// Page endpoints.
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
