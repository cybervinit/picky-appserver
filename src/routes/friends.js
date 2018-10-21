const dbHelper = require('../helpers/dbHelper');
const authHelper = require('../helpers/authenticate');

module.exports = (app) => {
  app.post('/friend', authHelper.isUserAuthorized, (req, res) => {
    const {friendId} = req.body;
    const {id} = req.decoded;
    dbHelper.addFriend(id, friendId);
    res.send({message: 'Added friend'});
  });

  app.delete('/friend', authHelper.isUserAuthorized, (req, res) => {
    const {friendId} = req.body;
    const {id} = req.decoded;
    dbHelper.deleteFriend(id, friendId);
    res.send({message: 'Deleted friend'});
  });

  app.get('/friend', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const friendInfo = await dbHelper.getUser(id);
    res.send({...friendInfo, message: 'Got friend'});
  });

  app.get('/friends', authHelper.isUserAuthorized, async (req, res) => {
    const {id} = req.decoded;
    const friends = await dbHelper.getFriends(id);
    res.send({friends, message: 'Got friends'});
  });

  app.get('/friends/:page', authHelper.isUserAuthorized, async (req, res) => {
    const {page} = req.params;
    const {id} = req.decoded;
    const friends = await dbHelper.getFriendsWithPage(id, page);
    res.send({friends, message: `Got friends on page ${page}`});
  });

  app.get('/me', authHelper.isUserAuthorized, (req, res) => {
    res.status(200).send({...req.decoded, message: 'This is your user id'});
  });
};
