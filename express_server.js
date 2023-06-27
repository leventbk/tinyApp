function generateShortURL() {
	let shortURL = '';
	const length = 6;
	const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
 
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		shortURL += characters[randomIndex];
	}
	return shortURL;
}

const express = require('express');
const cookieParser = require('cookie-parser'); 
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

const urlDatabase = { //JSON object
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//middleware app.use
app.use(express.urlencoded({ extended: true})); //will convert the request body from a Buffer into string (If you find that req.body is undefined, it may be that the body-parser middleware is not being run correctly.)

app.use(cookieParser());


app.get("/", (req, res) => {
	res.send("Hello!");
});
// Create
app.post("/urls", (req, res) => {
	let longURL = req.body.longURL;
	const shortURL = generateRandomString();
	urlDatabase[shortURL] = longURL;
	res.redirect(`/urls/${shortURL}`);
  });

app.get('/urls.json', (req, res) => {
	res.json(urlDatabase)
})

//OK
app.get("/urls", (req, res) => {
	const templateVars = { urls: urlDatabase };
	res.render("urls_index", templateVars)
})

//OK
app.get("/urls/new", (req, res) => {
	res.render("urls_new");
})

// app.get('/urls/:id', (req, res) => {
// 	const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
// 	res.render('urls_show', templateVars);
//   });



app.get("/urls/:id", (req, res) => {
	const id = req.params.id;
	const templateVars = { id: id, longURL: urlDatabase[id]};
	res.render("urls_show", templateVars);
});

// app.post("/urls", (req, res) => {
// 	console.log(req.body); // Log the POST request body to the console
// 	res.send("Ok"); // Respond with 'Ok' (we will replace this)
//   });
//create
app.post("/urls", (req, res) => {
	let longURL = req.body.longURL;
	const shortURL = generateRandomString();
	urlDatabase[shortURL] = longURL;
	res.redirect(`/urls/${shortURL}`);
  });

//OK
app.post("/urls/:id/delete", (req, res) => {
	delete urlDatabase[req.params.id]
	console.log(req.body);
	res.redirect('/urls')

})


//UPDATE
app.post('/urls/:id', (req, res) => {
	urlDatabase[req.params.id] = req.body.editURL;
	res.redirect('/urls');
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
