
const authenticate = (req, res, next) => {
  if (req.session.quiz) {
    next();
    return;
  }
  return res.send({ message: 'unauthenticated' });
};

module.exports = { authenticate };
