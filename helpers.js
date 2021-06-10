const bcrypt = require("bcrypt");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "$2b$10$AOVC5x0lFdC5BEK6TSb1vOoo3mUI4TflgM5SKa2FNNqcwVefylccu", //original 123123
  },
  as344j: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$.2AfTtME1AlqA3ndkQ4AbuvZ0H.bAnCoa7UndQIl2fKlPq/9GvxZy", //original 123321
  },
};

function filter(urlDatabase, userId) {
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

function checkUserId(email, password) {
  for (let user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].password)) {
      return user;
    }
  }
}

function isRegisted(email) {
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