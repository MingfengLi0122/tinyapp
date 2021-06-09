const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get("/", (req, res) => {
  res.send("Hello!");
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
  const id = req.cookies.user_id;
  const templateVars = {
    user: users[id],
  };
  res.render("user_regis", templateVars);
});

app.get("/login", (req, res) => {
  const id = req.cookies.user_id;
  const templateVars = {
    user: users[id],
  };
  res.render("user_login", templateVars);
});

app.get("/urls", (req, res) => {
  const id = req.cookies.user_id;
  const templateVars = { urls: urlDatabase, user: users[id] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id;
  const templateVars = { urls: urlDatabase, user: users[id] ,};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies.user_id;
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[id],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/login", (req, res) => {
  //console.log(users);
  if (!req.body.email || !req.body.password) {
    return res.status(400).send("Username/Password can not be empty!");
  }
  if (!isRegisted(req.body.email)) {
    return res.status(403).send("Unregistered email address!")
  }
  if (isRegisted(req.body.email)) {
    if (isNotCorrectPassword(req.body.email, req.body.password)) {
      return res.status(403).send("Wrong password!");
    }
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
    return res.status(400).send("Username/Password can not be empty!");
  }

  if (isRegisted(req.body.email)) {
    return res.status(400).send("Email address has been registerd!");
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
