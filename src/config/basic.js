const cryptoRandomString = require('crypto-random-string');

const errHandler = function (err, obj) {
  if (err) { throw err; }
};

const errWrap = (fn) => (...args) => fn(...args).catch(args[2]);

const err = (errMsg, errStatus) => {
  const err1 = new Error(errMsg);
  err1.status = errStatus || 200;
  return err1;
};

const getRandomString = () => {
  return cryptoRandomString({ length: 5, characters: '1234567890abcdefghijklmnopqrstuvwxyz-' });
};

module.exports = {
  errHandler,
  errWrap,
  err,
  getRandomString
};
