const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send({
      message: 'You must login!'
    });
  }
};

const isUserAuthorized = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET || 'pass', (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.decoded = decoded;
    next();
  });
};

module.exports = {
  isUserAuthenticated,
  isUserAuthorized
};
