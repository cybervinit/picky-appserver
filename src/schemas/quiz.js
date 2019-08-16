const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  quizId: Schema.Types.String,
  quizTemplateId: Schema.Types.String,
  userFirstName: Schema.Types.String,
  userPasswordHash2: Schema.Types.String,
  answerMatrix: [[Schema.Types.Number]]
});

module.exports = mongoose.model('Quiz', quizSchema);
