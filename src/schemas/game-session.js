const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const GameSessionSchema = new Schema({
  name: { type: String, lowercase: true },
  users: [String],
  isGameSessionFree: Boolean,
  startCountdownTime: { type: Number, default: (new Date()).getTime() },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
