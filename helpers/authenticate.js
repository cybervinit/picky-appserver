var rClient = require('../config/externals.js').redis;
var assert = require('assert');
var bcrypt = require('bcrypt');

module.exports.checkSessionID = async (username, sessionID) => {
	// TODO: check session ID
	const correctKey = await rClient.getAsync(username); 
	assert.notStrictEqual(correctKey, null, "could not authenticate session: user session doesn't exist");
	assert.strictEqual(correctKey, sessionID, "could not authenticate: invalid sessionID \"" + sessionID + "\" provided");
};

module.exports.setSessionID = async (username, sessionID) => {
	const saltRounds = 4;
	const newUnhashedID = username + (new Date()).toISOString();
	var newID = await bcrypt.hash(newUnhashedID, saltRounds);
	await rClient.set(username, newID);
};

