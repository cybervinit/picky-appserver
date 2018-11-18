const { GameSession, User } = require('../schemas');

const addUser = async (userInfo) => {
  await User.count({...userInfo}, (err, count) => {
    if (err || count === 0) {
      const newUser = new User({
        ...userInfo,
        friends: []
      });
      newUser.save((err) => {
        if (err) console.log(err);
      });
    }
  });
  return User.findOne({...userInfo});
};

const getUser = async (userId) => {
  const user = await User.findOne({_id: userId});
  return {
    firstName: user.firstName,
    lastName: user.lastName
  };
};

const getUserWithUsername = async (username) => {
  const user = await User.findONe({username});
  return user;
};

const getFriends = async (userId) => {
  const user = await User.findOne({_id: userId});
  return user.friends;
};

const getFriendsWithPage = async (userId, page) => {
  const perPage = 9;
  const friends = await User
    .findOne({_id: userId})
    .select('friends')
    .skip((perPage * page) - perPage)
    .limit(perPage);
  return friends;
};

const addFriend = async (userId, friendId) => {
  const user = await User.findOne({_id: userId});
  if (!user.friends.find(element => element === friendId)) {
    User.update({_id: userId}, {friends: [...user.friends, {friendId}]}, (err, raw) => {
      if (err) console.log(err);
    });
  }
};

const deleteFriend = async (userId, friendId) => {
  const user = await User.findOne({_id: userId});
  if (user.friends.find(element => element.friendId === friendId)) {
    User.update({_id: userId}, {friends: user.friends.filter((element) => element.friendId !== friendId)}, (err, raw) => {
      if (err) console.log(err);
    });
  }
};

const getGameSession = async (gameSessionName) => {
  const session = await GameSession.findOne({ name: gameSessionName });
  return session;
};

const addGameSession = async (gameSessionName) => {
  const gameSession = await GameSession.create({ name: gameSessionName });
  return gameSession;
};

module.exports = {
  addUser,
  addFriend,
  deleteFriend,
  getFriends,
  getFriendsWithPage,
  getUser,
  getUserWithUsername,
  getGameSession,
  addGameSession
};
