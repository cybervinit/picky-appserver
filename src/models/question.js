/**
 * @deprecated
 */

const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
  title: String,
  index: Number
});

const QuestionSchema = new Schema({
  username: String,
  title: String,
  options: [OptionSchema],
  visibility: Number // 0 is anon, 1 is friends, 2 is public
});

module.exports.Question = mongoose.model('Question', QuestionSchema);
