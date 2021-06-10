const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const { getUserByEmail, generateRandomString, isRegisted, checkUserId, filter } = require("./helpers");

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["secret keys"]
}));
app.set("view engine", "ejs");

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

app.get("/", (req, res) => {
  if (!req.session.user_id) {
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
  if (req.session.user_id) {
    res.redirect("/login");
    return;
  } 
  const id = req.session.user_id;
  const templateVars = { user: users[id] };
  res.render("user_regis", templateVars);
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
    return;
  } 
  
  const id = req.session.user_id;
  const templateVars = { user: users[id] };
  res.render("user_login", templateVars);
});

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send("Not login yet!");
    return;
  }
  const id = req.session.user_id;
  let filteredDataBase = filter(urlDatabase, id);
  const templateVars = { urls: filteredDataBase, user: users[id] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }
  const id = req.session.user_id;
  const templateVars = { urls: urlDatabase, user: users[id] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send("Not login yet!");
    return;
  }
  
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("Do not own this url!");
    return;
  }
  const id = req.session.user_id;
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("Do not own this url!");
    return;
  }
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send("Not login yet!");
    return;
  }
  const shortURL = generateRandomString();
 
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  res.redirect("/urls/");
});

app.post("/urls/:id/delete", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send("Not login yet!");
    return;
  }
  if (!urlDatabase[req.params.id]) {
    res.status(404).send("Do not own this url!");
    return;
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
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
  
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  if (!bcrypt.compareSync(req.body.password, hashedPassword)) {
    res.status(403).send("Wrong Username/Password!");
    return;
  }
  
  const userId = checkUserId(req.body.email, req.body.password);

  req.session.user_id = userId;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
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

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const user = {
    id: id,
    email: req.body.email,
    password: hashedPassword,
  };

  users[id] = user;

  req.session.user_id = id;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
