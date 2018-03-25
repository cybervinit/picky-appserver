const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
	title: String,
	pickers: [String]
});

const QuestionSchema = new Schema({
	title: String,
	options: [OptionSchema],
	visibility: Number // 0 is anon, 1 is friends, 2 is public 
});

const QuestionBucketSchema = new Schema({
	username: { type: String, lowercase: true },
	bucket: [QuestionSchema]
});

module.exports.QuestionBucket = mongoose.model('QuestionBucket', QuestionBucketSchema);

