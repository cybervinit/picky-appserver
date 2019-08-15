const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizQuestionSchema = new Schema({
  quizTemplateId: Schema.Types.String, // id of the QuizTemplate
  questionText: Schema.Types.String,
  options: [Schema.Types.String] // order matters
});

module.exports = mongoose.model('QuizQuestion', quizQuestionSchema);
