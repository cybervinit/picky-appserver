const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const GameSessionSchema = new Schema({
  name: { type: String, lowercase: true }
});

module.exports.GameSession = mongoose.model('GameSession', GameSessionSchema);
