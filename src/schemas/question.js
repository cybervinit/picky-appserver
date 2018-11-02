const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question: String,
  options: [String]
});

module.exports = mongoose.model('question', questionSchema);
