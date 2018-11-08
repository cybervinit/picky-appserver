const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  firstName: String,
  lastName: String,
  username: String,
  loggedIn: Boolean,
  created: Date,
  passwordHash: String,
  phone: String,
  friends: [{
    friendUsername: String,
    friendId: String
  }],
  questionsAnswered: [{question: String, user: String, option: String}],
  unseenAnswers: [{question: String, option: String}],
  seenAnswers: [{question: String, option: String}],
  questionCount: Number
});

module.exports = mongoose.model('user', userSchema);
