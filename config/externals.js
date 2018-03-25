const Promise = require('bluebird');
const mongoose = require('mongoose');
const dbUrl = process.env.PICKY_DB_URL;
mongoose.connect(dbUrl);

const redis = Promise.promisifyAll(require('redis').createClient(process.env.PICKY_REDIS_SESSIONS_PORT, process.env.PICKY_REDIS_SESSIONS_HOST));

module.exports.mongoose = mongoose;
module.exports.redis = redis;
