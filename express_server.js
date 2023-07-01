function generateShortURL() {
  let shortURL = '';
  const length = 6;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
 
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortURL.push(characters[randomIndex]);
  }
  return shortURL.join("");
};

function urlsForUser(id) {
  const urls = {};
  for ( const item in urlDatabase) {
    if ( urlDatabase[item].userID === id) {
      urls[item] = urlDatabase[item];
    }
  }
  return urls;
}

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

//Database
const urlDatabase = {
  b6UTxQ: {
    longURL: "http://www.leventkarakus.com",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "randomID",
    email: "user2@example.com",
    password: "idioticGamer",
  },
};

//middleware app.use
app.use(express.urlencoded({ extended: true})); //will convert the request body from a Buffer into string (If you find that req.body is undefined, it may be that the body-parser middleware is not being run correctly.)
app.use(cookieSession({
  name: 'session',
  keys: ['keys1'],
  maxAge: 24 * 60 * 60 * 1000 }));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Hello!");
});

// Create
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.send('Only logged in users can shorten URLs.');
  }
  let longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

// Read
app.get('/urls', (req, res) => {
  if (!req.session.user_id) {
    return res.send('Please log in or register first');
  }
  const templateVars = { urls: urlsForUser(req.session.user_id), user: users[req.session.user_id] };
  res.render('urls_index', templateVars);
});
  
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


//OK
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render('urls_show', templateVars);
});
app.get('/urls/:id', (req, res) => {
	const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
	res.render('urls_show', templateVars);
  });

//update
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = { id: id, longURL: urlDatabase[id]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
	console.log(req.body); // Log the POST request body to the console
	res.send("Ok"); // Respond with 'Ok' (we will replace this)
  });
//create
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  const shortURL = generateShortURL();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// Delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  console.log(req.body);
  res.redirect('/urls');
});

app.get('/u/:id', (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (!longURL) {
	  res.status(404).send("Not found");
  } else {
	  res.redirect(longURL);
  }
});

//UPDATE
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.editURL;
  res.redirect('/urls');
});


// /login
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = re.body.password;
  const user = findUserByEmail(email);

  if (!user) {
    res.status(403).send('The user does not exist.')
  }
  if (!bcrypt.compareSync(password, user.hashedPassword)) {
    res.status(403).send('Password does not match')
  }
  res.redirect('/urls');
});
  
// logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  }
  const templateVars = { user: users[req.session.user_id] };
  res.render('login', templateVars);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
