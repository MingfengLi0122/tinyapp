const bcrypt = require("bcrypt");

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

const checkUserId = function(email, password, users) {
  for (let user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].password)) {
      return user;
    }
  }
}

const isRegisted = function(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
}

const generateRandomString = function() {
  return Math.random().toString(36).substring(7);
}

module.exports = { generateRandomString, isRegisted, checkUserId, filter };