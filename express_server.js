const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true})); //will convert the request body from a Buffer into string (If you find that req.body is undefined, it may be that the body-parser middleware is not being run correctly.)

const urlDatabase = { //JSON object
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateShortURL() {
	const shortURL = '';
	const length = 6;
	const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
 
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		shortURL += characters[randomIndex];
	}
	return shortURL;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
	res.json(urlDatabase)
})

app.get("/urls", (req, res) => {
	const templateVars = { urls: urlDatabase };
	res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
	res.render("urls_new");
})

app.get("/urls/:id", (req, res) => {
	const id = req.params.id;
	const templateVars = { id: id, longURL: urlDatabase[id]};
	res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
	console.log(req.body); // Log the POST request body to the console
	res.send("Ok"); // Respond with 'Ok' (we will replace this)
  });
// app.get("/hello", (req, res) => {
// 	const templateVars = { greeting: "Hello World!" };
// 	res.render("hello_world", templateVars);
//   });
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
