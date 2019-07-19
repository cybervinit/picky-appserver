const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: String,
  options: [{
    optionText: String
  }],
  dateAdded: Schema.Types.String // dd-mm-yyyy
});

module.exports = mongoose.model('Question', questionSchema);
