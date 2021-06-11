const bcrypt = require("bcrypt");
// fitler out the data which is only under that userID
const filter = function(urlDatabase, userId) {
  let res = {};
  if (userId) {
    for (let shortURL in urlDatabase) {
      if (urlDatabase[shortURL].userID === userId) {
        res[shortURL] = urlDatabase[shortURL].longURL;
      }
    }
  }
  return res;
}
// return the userID based on the provided email and passowrd
const checkUserId = function(email, password, users) {
  for (let user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].password)) {
      return user;
    }
  }
}
// verify the user is registed or not
const isRegisted = function(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
}
// generate randon 6 digits long string for shortURL
const generateRandomString = function() {
  return Math.random().toString(36).substring(7);
}

module.exports = { generateRandomString, isRegisted, checkUserId, filter };