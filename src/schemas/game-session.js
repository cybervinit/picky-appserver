const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const GameSessionSchema = new Schema({
  name: { type: String, lowercase: true },
  users: [String],
  isGameSessionFree: Boolean
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
