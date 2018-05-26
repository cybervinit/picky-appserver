
module.exports.auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.end(JSON.stringify({ message: 'unauthorized' }))
}

/**
 * DEPRECATED - Use express-session instead
 */

// // DEPRECATED
// module.exports.checkSessionID = async (username, sessionID) => {
//   // TODO: check session ID
//   const correctKey = await rClient.getAsync(username)
//   assert.notStrictEqual(correctKey, null, "could not authenticate session: user session doesn't exist")
//   assert.strictEqual(correctKey, sessionID, 'could not authenticate: invalid sessionID "' + sessionID + '" provided')
// }

// // DEPRECATED
// module.exports.setSessionID = async (username, sessionID) => { // Also returns the created sessionID
//   const saltRounds = 4
//   const newUnhashedID = username + (new Date()).toISOString()
//   var newID = await bcrypt.hash(newUnhashedID, saltRounds)
//   await rClient.set(username, newID)
//   return newID;
// }
