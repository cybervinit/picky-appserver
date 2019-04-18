const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: String,
  options: [{
    optionText: String
  }]
});

module.exports = mongoose.model('Question', questionSchema);
