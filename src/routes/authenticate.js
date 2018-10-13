const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const authHelper = require('../helpers/authenticate');

module.exports = (app) => {
  app.use(passport.initialize()); // Used to initialize passport
  app.use(passport.session()); // Used to persist login sessions

  // Strategy config
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/auth/google/callback`
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile); // passes the profile data to serializeUser
  }
  ));

  // Used to stuff a piece of information into a cookie
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Used to decode the received cookie and persist session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  // passport.authenticate middleware is used here to authenticate the request
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
  }));

  // The middleware receives the data from Google and runs the function on Strategy config
  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/secret');
  });

  // Secret route, example on how to restrict access to routes.
  app.get('/secret', authHelper.isUserAuthenticated, (req, res) => {
    res.send('You have reached the secret route');
  });

  // Logout route
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};
