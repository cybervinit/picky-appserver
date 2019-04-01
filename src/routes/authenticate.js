const passport = require('passport');
const jwt = require('jsonwebtoken');
const GoogleStrategy = require('passport-google-oauth20');
const GoogleIdTokenStrategy = require('passport-google-id-token');
const authHelper = require('../helpers/authenticate');
const { User } = require('../schemas/user');
const dbHelper = require('../helpers/dbHelper');

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

  passport.use(new GoogleIdTokenStrategy({
    clientID: process.env.CLIENT_ID
  },
  async (parsedToken, googleId, done) => {
    const user = await User.findOne({ googleId: googleId });
    if (!user) {
      const userCount = await User.count();
      const newUser = await User.create({
        googleId: googleId,
        username: `superstar${userCount}`,
        name: parsedToken.payload.name,
        isNewAccount: true
      });
      return done(null, {
        friendAmount: newUser.friendAmount,
        username: newUser.username,
        name: newUser.name,
        isNewAccount: newUser.isNewAccount
      });
    }

    return done(null, {
      friendAmount: user.friendAmount,
      username: user.username,
      name: user.name,
      isNewAccount: user.isNewAccount
    });
  }));

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
  app.get('/auth/google/callback', passport.authenticate('google'), async (req, res) => {
    const {id, name} = req.user;
    const {familyName, givenName} = name;
    const userInfo = {
      googleId: id,
      firstName: familyName,
      lastName: givenName
    };
    const user = await dbHelper.addUser(userInfo);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'pass', {
      expiresIn: 8640000
    });
    res.send({token, message: 'User has been authenticated'});
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

  app.post('/auth/google/phone', passport.authenticate('google-id-token'), (req, res) => {
    res.send({
      message: req.user.isNewAccount ? 'signup' : 'success'
    });
    res.end();
  });
};
