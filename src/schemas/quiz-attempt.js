const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizAttemptSchema = new Schema({
  quizAttemptId: Schema.Types.String,
  quizId: Schema.Types.String,
  message: Schema.Types.String,
  answerArray: [Schema.Types.Number]
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
