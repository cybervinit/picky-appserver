const winston = require('winston'); // Logger
const validator = require('validator');

let errHandler = function (err, obj) {
  if (err) { throw err; }
};

let errWrap = (fn) => (...args) => fn(...args).catch(args[2]);

let routeCheck = function (res, endpoint) {
  res.end('Reached: ' + endpoint);
};

const end = (res, obj) => {
  return res.end(JSON.stringify(obj));
};

const reqLog = (req) => {
  if (req.headers) winston.info(req.headers);
  if (req.body) winston.info(req.body);
  if (req.params) winston.info(req.params);
  if (req.query) winston.info(req.query);
};

const isValidUsername = (username) => {
  return (username && ((username.length >= 3) && (username.length <= 20)));
};

const isPhoneValid = (phone) => {
  return (phone !== undefined) && (validator.isMobilePhone(phone, validator.isMobilePhoneLocales, { strictMode: true }));
};

module.exports.errHandler = errHandler;
module.exports.errWrap = errWrap;
module.exports.routeCheck = routeCheck;
module.exports.end = end;
module.exports.reqLog = reqLog;
module.exports.isValidUsername = isValidUsername;
module.exports.isPhoneValid = isPhoneValid;
