const mongoose = require('../config/externals.js').mongoose;
const Schema = mongoose.Schema;

const QuestionRoomSchema = new Schema({
  questionRef: { type: Schema.Types.ObjectId, ref: 'Question' },
  urlId: Schema.Types.String,
  users: [{
    username: Schema.Types.String,
    isSeen: Schema.Types.Boolean,
    answerIndex: { type: Schema.Types.Number, default: -1 }
  }]
});

module.exports = mongoose.model('QuestionRoom', QuestionRoomSchema);
