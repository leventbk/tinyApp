const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true})); //will convert the request body from a Buffer into string 

const urlDatabase = { //JSON object
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

// app.get("/hello", (req, res) => {
// 	const templateVars = { greeting: "Hello World!" };
// 	res.render("hello_world", templateVars);
//   });
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
