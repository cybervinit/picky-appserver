const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizAttemptSchema = new Schema({
  quizAttemptId: Schema.Types.String,
  quizId: Schema.Types.String,
  message: { type: Schema.Types.String, default: '' },
  answerArray: [Schema.Types.Number],
  score: { type: Schema.Types.Number, default: 0 }, // percent out of 100
  isResultSeen: { type: Schema.Types.Boolean, default: false }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
