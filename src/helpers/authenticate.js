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

module.exports = {
  isUserAuthenticated
};
