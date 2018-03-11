const mongoose = require('mongoose');
const dbUrl = process.env.PICKY_DB_URL;
mongoose.connect(dbUrl);


module.exports.mongoose = mongoose;

