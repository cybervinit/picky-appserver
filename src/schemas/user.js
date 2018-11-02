const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  firstName: String,
  lastName: String,
  userName: String,
  loggedIn: Boolean,
  created: Date,
  friends: [{
    friendUsername: String,
    friendId: String
  }],
  questionsAnswered: [String],
  unseenAnswers: [{question: String, option: String}],
  seenAnswers: [{question: String, option: String}],
  questionCount: Number
});

module.exports = mongoose.model('user', userSchema);
