const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const GameSessionSchema = new Schema({
  name: { type: String, lowercase: true },
  users: [String],
  isGameSessionFree: Boolean,
  startCountdownTime: { type: Number, default: (new Date()).getTime() },
  questions: [{
    answerer: String,
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    answer: Number,
    isAnswered: { type: Boolean, default: false },
    isSeen: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
