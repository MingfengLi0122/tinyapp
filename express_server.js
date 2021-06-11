/* —————————————————————————————————————————————————————————————————————————————————————————————— */
// Set up configuration
const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const { generateRandomString, isRegisted, checkUserId, filter } = require("./helpers");
const { urlDatabase, users } = require("./database/databaseObj");
// Set up functions
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ["secret keys"]
}));
app.set("view engine", "ejs");
/* —————————————————————————————————————————————————————————————————————————————————————————————— */
// GET requests
// root - GET : if user is not logged in redirect to /login, otherwise go to /urls
app.get("/", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  } 
  res.redirect("/urls");
});
// urls display page -GET : display users' urls
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  let filteredDataBase = filter(urlDatabase, userID);
  const templateVars = { urls: filteredDataBase, user: users[userID] };
  if (!userID) {
    res.status(403).send("Not login yet!");
    return;
  }
  res.render("urls_index", templateVars);
});
// create new url - GET : validate user is logged in before displaying their own new urls
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id
  let filteredDataBase = filter(urlDatabase, userID);
  const templateVars = { urls: filteredDataBase, user: users[userID] };
  if (!userID) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});
// display short urls - GET: validate user is logged in before displaying their own urls
app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const filteredDataBase = filter(urlDatabase, userID);
  const shortURL = req.params.id;
  const id = req.session.user_id;
  if (!userID) {
    res.status(403).send("Not login yet!");
    return;
  }
  if (!filteredDataBase[shortURL]) {
    res.status(403).send("Do not own this url!");
    return;
  }
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[id]
  };
  res.render("urls_show", templateVars);
});
// redirect to longURL - GET : redirect to longURL stored in database
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send("This url does not exist!");
    return;
  }
  res.redirect(longURL);
});
// registration page diaplay - GET : redirect to /urls if logged in
app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { user: users[userID] };
  if (userID) {
    res.redirect("/urls");
    return;
  } 
  res.render("user_regis", templateVars);
});
// login page display - GET : redirect to /urls if logged in
app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { user: users[userID] };
  if (userID) {
    res.redirect("/urls");
    return;
  } 
  res.render("user_login", templateVars);
});
/* —————————————————————————————————————————————————————————————————————————————————————————————— */
// POST requests
// create new url - Post : add new url to database, then redirect to /urls/${shortURL}
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
// short url - POST : check user validation, then redirect to the choose url edit page
app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.id;
  const filteredDataBase = filter(urlDatabase, userID);
  if (!userID) {
    res.status(401).send("Not login yet!");
    return;
  }
  if (!filteredDataBase[shortURL]) {
    res.status(403).send("Do not own this url!");
    return;
  }
  res.redirect(`/urls/${shortURL}`);
});
// delete urls - POST : check user validation, and delete their own urls
app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  const filteredDataBase = filter(urlDatabase, userID);
  const shortURL = req.params.id;
  if (!userID) {
    res.status(401).send("Not login yet!");
    return;
  }
  if (!filteredDataBase[shortURL]) {
    res.status(403).send("Do not own this url!");
    return;
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
// edit urls - POST : check user validation, and edit their own urls
app.post("/urls/:id/edit", (req, res) => {
  const filteredDataBase = filter(urlDatabase, req.session.user_id);
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  const userID = req.session.user_id;
  if (!userID) {
    res.status(401).send("Not login yet!");
    return;
  }
  if (!filteredDataBase[shortURL]) {
    res.status(403).send("Do not own this url!");
    return;
  }
  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});
// login post - POST: verify users' email and password, then redirect to /urls
app.post("/login", (req, res) => {
  const inputEmail = req.body.email;
  const inputPassowrd = req.body.password;
  const hashedPassword = bcrypt.hashSync(inputPassowrd, 10);
  const userId = checkUserId(inputEmail, inputPassowrd, users);
  if (!inputEmail || !inputPassowrd) {
    res.status(400).send("Username/Password can not be empty!");
    return;
  }
  if (!isRegisted(inputEmail, users)) {
    res.status(403).send("Unregistered email address!");
    return;
  }
  if (!bcrypt.compareSync(inputPassowrd, hashedPassword)) {
    res.status(403).send("Wrong Username/Password!");
    return;
  }
  req.session.user_id = userId;
  res.redirect("/urls");
});
// resigter - POST : check validation of users registration, then redirect to /urls
app.post("/register", (req, res) => {
  const inputEmail = req.body.email;
  const inputPassowrd = req.body.password;
  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(inputPassowrd, 10);
  if (!inputEmail || !inputPassowrd) {
    res.status(400).send("Username/Password can not be empty!");
    return;
  }
  if (isRegisted(inputEmail, users)) {
    res.status(400).send("Email address has been registerd!");
    return;
  }
  const user = {
    id: id,
    email: inputEmail,
    password: hashedPassword,
  };
  users[id] = user;
  req.session.user_id = id;
  res.redirect("/urls");
});
// logout - POST : clean the cookie after user logout, then redirect to /urls
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
/* —————————————————————————————————————————————————————————————————————————————————————————————— */
// Server listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
