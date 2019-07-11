const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, lowercase: true },
  name: { type: String, lowercase: true },
  friendAmount: { type: Number, default: 0 },
  friendList: [String],
  profileVisible: { type: Boolean, default: true },
  googleId: String,
  isNewAccount: Boolean
});

module.exports.User = mongoose.model('User', UserSchema);
