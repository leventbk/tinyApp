//////////////
// App Configuration and modules
//////////////
const { getUserByEmail, generateShortURL, urlsForUser} = require('./helpers');
const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;


//////////////
// DATABASES
//////////////
const urlDatabase = {
  b6UTxQ: {
	  longURL: "https://www.tsn.ca",
	  userID: "aJ48lW",
  },
  i3BoGr: {
	  longURL: "https://www.google.ca",
	  userID: "aJ48lW",
  },
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


app.set('view engine', 'ejs');

//////////////
// Middleware
//////////////
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["key1"],

  // Cookie Lifetime Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

////////////////////////////////////////////////////////
// Routing
////////////////////////////////////////////////////////

// ROOT 
app.get('/', (req, res) => {
  // res.send('Hello! for tinyApp pls continue to /urls  <br><br> but do it yourself on address bar :) ');
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

//////////////
// URLs Index Page - GET
//////////////
app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    return res.send('Please log in or register first');
  }
  const templateVars = { urls: urlsForUser(req.session.user_id), user: users[req.session.user_id] };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  }
  const templateVars = { user: users[req.session.user_id] };
  res.render('urls_new', templateVars);
});

app.get('/urls/:id', (req, res) => {
  if (!req.session.user_id) {
    return res.send('Please log in first');
  }

  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    return res.send('This URL does not exist.');
  }

  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.send('You do not have access to this URL.');
  }

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.session.user_id] };
  res.render('urls_show', templateVars);
});
//////////////
// Create
//////////////
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.send('Only logged in users can shorten URLs.');
  }
  let longURL = req.body.longURL;
  const shortURL = generateShortURL();
  urlDatabase[shortURL] = { longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

//////////////
// Detele
//////////////
app.post('/urls/:id/delete', (req, res) => {
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    return res.send('This url does not exist!');
  }

  if (!req.session.user_id) {
    return res.send('Please log in first.');
  }
  if (urlDatabase[req.params.id].userID !== req.session.user_id) {
    return res.send('You do not have permission to delete this URL.');
  }

  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

//});

//////////////
// Update
//////////////
app.post('/urls/:id', (req, res) => {
  if (!Object.keys(urlDatabase).includes(req.params.id)) {
    return res.send('This URL does not exist.');
  }
  if (!req.session.user_id) {
    return res.send("Please log in first.");
  }

  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.send('You do not have access to this URL.');
  }
  // urlDatabase[req.params.id].longURL = req.body.editURL;
  // res.redirect('/urls');
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.session.user_id] };
  res.render('urls_show', templateVars);
});

app.get('/u/:id', (req, res) => {
  const shortURL = req.params.id;
  if (!Object.keys(urlDatabase).includes(shortURL)) {
    return res.send('URL does not exist.');
  }
  const longURL = urlDatabase[shortURL].longURL;
  if (!longURL) {
    res.status(404).send("Not found");
  } else {
    res.redirect(longURL);
  }
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


//////////////////
// AUTHENTICATION
//////////////////

// Login
app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = getUserByEmail(email, users);

  if (!user) {
    res.status(403).send('This account does not exist.');
  }

  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    res.status(403).send('Password does not match.');
  }

  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  
  if (req.session.user_id) {
    res.redirect('/urls');
  }
  
  const templateVars = { user: users[req.session.user_id] };
  res.render('login', templateVars);
});

// logout - cookie cleaning - POST
app.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/urls/login');
});

//////////////////
// Registeration
//////////////////
app.get('/register', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
    return;
  }
  const templateVars = { user: users[req.session.user_id] };
  res.render('registration', templateVars);
});

// function getUserByEmail(email) {
//   for (const item in users) {
//     if (users[item].email === email) {
//       return users[item];
//     }
//   }
//   return null;
// }

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    res.status(400).send('Email or password cannot be empty');
  }
  const user = getUserByEmail(email);
  if (user) {
    res.status(400).send('User already exists');
  }

  const id = generateShortURL();
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[id] = {
    id,
    email,
    hashedPassword
  };
  
  req.session.user_id = id;
  res.redirect('/urls');
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});