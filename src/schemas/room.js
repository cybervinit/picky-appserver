const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  urlId: String,
  users: [String]
});

module.exports = mongoose.model('Room', roomSchema);
