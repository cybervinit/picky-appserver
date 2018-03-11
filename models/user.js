const mongoose = require('../config/database.js').mongoose;
const Schema = mongoose.Schema;


const UserSchema = new Schema({
	username: String,
	phone: String
});

module.exports.User = mongoose.model('User', UserSchema);

