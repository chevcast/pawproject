var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
/*
 *var FacebookStrategy = require('passport-facebook').Strategy;
 *var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
 *var TwitterStrategy = require('passport-twitter').Strategy;
 */
var db = require('mongoose-simpledb').db;

// Login page.
router.get('/login', function(req, res) {
  res.render('auth/login', { title: 'Please login.' });
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect(req.session.redirectUrl);
});

// Signup page.
router.get('/signup', function (req, res) {
  res.render('auth/signup', { title: 'Sign up' });
});


/**********************************************************************************/

// Email & Password config
passport.use(new LocalStrategy(
  function(email, password, done) {
    db.User.findOne({ email: email }, function (err, user) {
      if (err) return console.error(err);
      if (!user || user.password !== password) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      user.lastActive = Date.now();
      user.save(done);
    });
  }
));

// Email & Password endpoint.
router.post('/login', passport.authenticate('local'), function (req, res) {
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
