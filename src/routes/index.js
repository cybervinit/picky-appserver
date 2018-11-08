const answer = require('./answer');
const authenticate = require('./authenticate');
const friends = require('./friends');
const questions = require('./questions');
const users = require('./users');

module.exports = (app) => {
  answer(app);
  authenticate(app);
  friends(app);
  questions(app);
  users(app);
};
