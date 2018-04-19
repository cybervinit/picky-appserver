
const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;
const ObjectId = require('mongodb').ObjectID;

const QuestionOptionSchema = new Schema({
	picker: String, // username of the picker
	action: Number, // 0 is "skipped", 1 is "answered"
	optionId: Schema.Types.ObjectId,
});


module.exports.QuestionOption = mongoose.model('QuestionOption', QuestionOptionSchema);

