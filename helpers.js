function getUserByEmail(email, users) {
	for (const item in users) {
	  if (users[item].email === email) {
		const user = users[item];
		return user;
	  }
	}
	return undefined;
};
  
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
  
function urlsForUser(id, urlDatabase) { // helper func for loop over a database and return urls whose user id matches with the given user id.
	const urls = {};
	for (const item in urlDatabase) {
	  if (urlDatabase[item].userID === id) {
		urls[item] = urlDatabase[item];
	  }
	}
	return urls;
};
  
  
  
module.exports = {
	getUserByEmail,
	generateShortURL,
	urlsForUser
};