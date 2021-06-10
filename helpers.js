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

function isRegisted(email, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
}

function generateRandomString() {
  return Math.random().toString(36).substring(7);
}

const getUserByEmail = function(email, database) {
  let user = "";
  for (let id in database) {
    if (database[id].email === email) {
      user = database[id].id;
    }
  }
  return user;
};


module.exports = { getUserByEmail, generateRandomString, isRegisted, checkUserId, filter };