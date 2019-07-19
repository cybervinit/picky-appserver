const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  urlId: String,
  users: [{
    username: Schema.Types.String,
    tipsSeen: [Schema.Types.Boolean]
  }],
  currentDate: Schema.Types.String
});

module.exports = mongoose.model('Room', roomSchema);
