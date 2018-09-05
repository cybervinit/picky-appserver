const mongoose = require('../config/externals.js').mongoose
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, lowercase: true },
  name: { type: String, lowercase: true },
  phone: String,
  passwordHash: String,
  followRequests: [String],
  followers: [String],
  following: [String],
  profileVisible: { type: Boolean, default: true }
})

module.exports.User = mongoose.model('User', UserSchema)
