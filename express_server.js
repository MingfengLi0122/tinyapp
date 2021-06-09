const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "123",
  },
};

app.get("/", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect("/login");
    return;
  } 
  res.redirect("/urls");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/register", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/login");
    return;
  } 
  const id = req.cookies.user_id;
  const templateVars = { user: users[id] };
  res.render("user_regis", templateVars);
});

app.get("/login", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls");
    return;
  } 
  const id = req.cookies.user_id;
  const templateVars = { user: users[id] };
  res.render("user_login", templateVars);
});

app.get("/urls", (req, res) => {
  const id = req.cookies.user_id;
  let filteredDataBase = filter(urlDatabase, id);
  const templateVars = { urls: filteredDataBase, user: users[id] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect("/login");
    return;
  }
  const id = req.cookies.user_id;
  const templateVars = { urls: urlDatabase, user: users[id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.cookies.user_id;
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: req.cookies.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Username/Password can not be empty!");
    return;
  }
  if (!isRegisted(req.body.email)) {
    res.status(403).send("Unregistered email address!");
    return;
  }
  
  if (isNotCorrectPassword(req.body.email, req.body.password)) {
    res.status(403).send("Wrong password!");
    return;
  }
  
  const userId = checkUserId(req.body.email, req.body.password);

  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Username/Password can not be empty!");
    return;
  }

  if (isRegisted(req.body.email)) {
    res.status(400).send("Email address has been registerd!");
    return;
  } 

  const id = generateRandomString();

  const user = {
    id: id,
    email: req.body.email,
    password: req.body.password,
  };

  users[id] = user;
  res.cookie("user_id", id);
  res.redirect("/urls");
});

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
    if (users[user].email === email && users[user].password === password) {
      console.log("matched user id:", user);
      return user;
    }
  }
}

function isNotCorrectPassword(email, password) {
  for (let user in users) {
    if (users[user].email === email && users[user].password !== password) {
      return true;
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
