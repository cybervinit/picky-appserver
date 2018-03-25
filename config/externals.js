const Promise = require('bluebird');
const mongoose = require('mongoose');
const dbUrl = process.env.PICKY_DB_URL;
mongoose.connect(dbUrl);

const redis = Promise.promisifyAll(require('redis').createClient(process.env.PICKY_REDIS_SESSIONS_PORT, process.env.PICKY_REDIS_SESSIONS_HOST));

var redis = require('redis').createClient(process.env.PICKY_REDIS_SESSIONS_PORT, process.env.PICKY_REDIS_SESSIONS_HOST)

if (process.env.NODE_ENV !== "development") {
	redis.auth(process.env.REDIS_SESSION_AUTH_KEY, (err) => {
		if (err) throw err;
	})
}

module.exports.mongoose = mongoose;
module.exports.redis = redis;
