const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  quizId: Schema.Types.String,
  quizTemplateId: Schema.Types.String,
  user: Schema.Types.String,
  orderedAnswers: [[Schema.Types.Number]]
});

module.exports = mongoose.model('Quiz', quizSchema);
