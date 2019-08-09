const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizTemplateSchema = new Schema({
  name: Schema.Types.String,
  quizTemplateId: Schema.Types.String
});

module.exports = mongoose.model('QuizTemplate', quizTemplateSchema);
