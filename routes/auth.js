var express = require('express');
var validator = require('express-validator');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/*
 *var FacebookStrategy = require('passport-facebook').Strategy;
 *var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
 *var TwitterStrategy = require('passport-twitter').Strategy;
 */
var db = require('mongoose-simpledb').db;

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id, done);
});

// Login page.
router.get('/login', function(req, res) {
  res.render('auth/login', { title: 'Please login.' });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect(req.session.redirectUrl);
});

/**********************************************************************************/

// Signup page.
router.get('/signup', function (req, res) {
  res.render('auth/signup', {
    title: 'Sign up'
  });
});

// Signup submit.
router.post('/signup', function (req, res) {
  var email = req.param('email');
  var confirmEmail = req.param('confirmEmail');
  var password = req.param('password');
  var confirmPassword = req.param('confirmPassword');
  var firstName = req.param('firstName');
  var lastName = req.param('lastName');
  var authCode = req.param('authCode').replace(/-/g, '');
  var errors = {};

  function invalidate(errors) {
    res.render('auth/signup', {
      title: 'Sign up errors',
      errors: errors,
      body: req.body
    });
  }

  if (email !== confirmEmail) {
    errors.confirmEmail = {
      message: 'Emails do not match.'
    };
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = {
      message: 'Passwords do not match.'
    };
  }

  if (Object.keys(errors).length > 0) {
    return invalidate(errors);
  }

  db.AuthCode.findOne({ code: authCode }, function (err, authCode) {
    if (err) return console.error(err);
    if (!authCode) {
      errors.authCode = {
        message: 'Authorization code invalid.'
      };
      return invalidate(errors);
    }
    var newUser = new db.User({
      email: email,
      password: password,
      name: {
        first: firstName,
        last: lastName
      },
      // TODO: check authCode for role type.
      superAdmin: true
    });
    newUser.save(function (err, user) {
      if (err && err.errors) {
        return invalidate(err.errors);
      }
      authCode.remove(function (err) {
        if (err) return console.error(err);
        req.logIn(user, function (err) {
          if (err) return console.error(err);
          res.redirect(req.session.redirectUrl);
        });
      });
    });
  })
});


/**********************************************************************************/

// Email & Password config
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  function(email, password, done) {
    console.log(email, password);
    db.User.findOne({ email: email }, function (err, user) {
      if (err) return done(err);
      if (!user || user.password !== password) {
        return done(null, false);
      }
      user.lastActive = Date.now();
      user.save(done);
    });
  }
));

// Email & Password endpoint.
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('auth/login', {
      title: 'Invalid Credentials',
      errors: {
        failure: {
          message: 'Invalid email or password.'
        }
      }
    }); }
    req.logIn(user, next);
  })(req, res, next);
}, function (req, res) {
  res.redirect(req.session.redirectUrl);
});

/**********************************************************************************/

// Twitter config
/*
 *passport.use(new TwitterStrategy({
 *    consumerKey: process.env.TWITTER_CONSUMER_KEY,
 *    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
 *    callbackURL: process.env.HOST + '/auth/twitter/callback'
 *  },
 *  function(token, tokenSecret, profile, done) {
 *    db.User.findOne({ twitterId: profile.id }, function (err, user) {
 *      if (err) return console.error(err);
 *      if (!user) {
 *        user = new db.User({
 *          twitterId: profile.id,
 *          name: {
 *            first: profile.name.givenName,
 *            last: profile.name.familyName
 *          }
 *        });
 *        if (profile.emails.length > 0) {
 *          user.email = profile.emails[0].value;
 *        }
 *      }
 *      user.lastActive = Date.now();
 *      user.save(done);
 *    });
 *  }
 *));
 */

// Twitter endpoints.
/*
 *router.get('/twitter', passport.authenticate('twitter'));
 *router.get('/twitter/callback', passport.authenticate('twitter'), function (req, res) {
 *  res.redirect(req.session.redirectUrl);
 *});
 */

/**********************************************************************************/

// Facebook config
/*
 *passport.use(new FacebookStrategy({
 *    clientID: process.env.FACEBOOK_APP_ID,
 *    clientSecret: process.env.FACEBOOK_APP_SECRET,
 *    callbackURL: process.env.HOST + '/auth/facebook/callback'
 *  },
 *  function(accessToken, refreshToken, profile, done) {
 *    db.User.findOne({ facebookId: profile.id }, function (err, user) {
 *      if (err) return console.error(err);
 *      if (!user) {
 *        user = new db.User({
 *          facebookId: profile.id,
 *          name: {
 *            first: profile.name.givenName,
 *            last: profile.name.familyName
 *          }
 *        });
 *        if (profile.emails.length > 0) {
 *          user.email = profile.emails[0].value;
 *        }
 *      }
 *      user.lastActive = Date.now();
 *      user.save(done);
 *    });
 *  }
 *));
 */

// Facebook endpoints.
/*
 *router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
 *router.get('/facebook/callback', passport.authenticate('facebook'), function (req, res) {
 *  res.redirect(req.session.redirectUrl);
 *});
 */

/**********************************************************************************/

// Google config
/*
 *passport.use(new GoogleStrategy({
 *    clientId: process.env.GOOGLE_CLIENT_ID,
 *    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *    callbackURL: process.env.HOST + '/auth/google/callback'
 *  },
 *  function(accessToken, refreshToken, profile, done) {
 *    db.User.findOne({ googleId: profile.id }, function (err, user) {
 *      if (err) return console.error(err);
 *      if (!user) {
 *        user = new db.User({
 *          googleId: profile.id,
 *          name: {
 *            first: profile.name.givenName,
 *            last: profile.name.familyName
 *          }
 *        });
 *        if (profile.emails.length > 0) {
 *          user.email = profile.emails[0].value;
 *        }
 *      }
 *      user.lastActive = Date.now();
 *      user.save(done);
 *    });
 *  }
 *));
 */

// Google endpoints.
/*
 *router.get('/auth/google', passport.authenticate('google', {
 *  scope: [
 *    'https://www.googleapis.com/auth/userinfo.profile',
 *    'https://www.googleapis.com/auth/userinfo.email'
 *  ]
 *}));
 *router.get('/auth/google/callback', passport.authenticate('google'), function(req, res) {
 *  res.redirect(req.session.redirectUrl);
 *});
 */

/**********************************************************************************/

module.exports = router;
