const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const { generateRandomString, isRegisted, checkUserId, filter } = require("./helpers");
const { urlDatabase, users } = require("./database/databaseObj");

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["secret keys"]
}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  } 
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    res.redirect("/login");
    return;
  } 
  
  const templateVars = { user: users[userID] };
  res.render("user_regis", templateVars);
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  if (userID) {
    res.redirect("/urls");
    return;
  } 
  
  const templateVars = { user: users[userID] };
  res.render("user_login", templateVars);
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.status(403).send("Not login yet!");
    return;
  }
  
  let filteredDataBase = filter(urlDatabase, userID);
  const templateVars = { urls: filteredDataBase, user: users[userID] };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id
  if (!userID) {
    res.redirect("/login");
    return;
  }
  
  const templateVars = { urls: urlDatabase, user: users[userID] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.status(403).send("Not login yet!");
    return;
  }
  
  const filteredDataBase = filter(urlDatabase, userID);
  const shortURL = req.params.id;
  
  if (!filteredDataBase[shortURL]) {
    res.status(403).send("Do not own this url!");
    return;
  }
  
  const id = req.session.user_id;
  
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[id]
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id; 
  if (!urlDatabase[shortURL]) {
    res.status(404).send("This url does not exist!");
    return;
  }
  
  const longURL = urlDatabase[shortURL].longURL;
  
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = generateRandomString();

  if (!userID ) {
    res.status(401).send("Not login yet!");
    return;
  }
 
  urlDatabase[shortURL] = { 
    longURL: req.body.longURL, 
    userID: userID 
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.id;

  if (!userID) {
    res.status(401).send("Not login yet!");
    return;
  }

  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    res.status(401).send("Not login yet!");
    return;
  }

  const filteredDataBase = filter(urlDatabase, userID);
  const shortURL = req.params.id;
  
  if (!filteredDataBase[shortURL]) {
    res.status(403).send("Do not own this url!");
    return;
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  const filteredDataBase = filter(urlDatabase, req.session.user_id);
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  
  if (!filteredDataBase[shortURL]) {
    res.status(403).send("Do not own this url!");
    return;
  }
  
  urlDatabase[shortURL].longURL = longURL;
  
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const inputEmail = req.body.email;
  const inputPassowrd = req.body.password;
  
  if (!inputEmail || !inputPassowrd) {
    res.status(400).send("Username/Password can not be empty!");
    return;
  }
  if (!isRegisted(inputEmail, users)) {
    res.status(403).send("Unregistered email address!");
    return;
  }
  
  const hashedPassword = bcrypt.hashSync(inputPassowrd, 10);

  if (!bcrypt.compareSync(inputPassowrd, hashedPassword)) {
    res.status(403).send("Wrong Username/Password!");
    return;
  }
  
  const userId = checkUserId(inputEmail, inputPassowrd, users);

  req.session.user_id = userId;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const inputEmail = req.body.email;
  const inputPassowrd = req.body.password;

  if (!inputEmail || !inputPassowrd) {
    res.status(400).send("Username/Password can not be empty!");
    return;
  }

  if (isRegisted(inputEmail, users)) {
    res.status(400).send("Email address has been registerd!");
    return;
  } 

  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(inputPassowrd, 10);

  const user = {
    id: id,
    email: inputEmail,
    password: hashedPassword,
  };

  users[id] = user;

  req.session.user_id = id;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
