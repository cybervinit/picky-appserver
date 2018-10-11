
/**
 * @function auth Uses the cookie part of the req to authorize the req (request)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports.auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('Authorized for request! :)');
    return next();
  }
  return res.end(JSON.stringify({ message: 'unauthorized' }));
};
