// Importer express og path modulerne
const express = require("express");
const PATH = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require('body-parser');
const fs = require('fs');

// Definer en port vi vil lytte på
const PORT = process.env.PORT || 3030;
const adminFilePath = PATH.join(__dirname, "../data/admin.json");


// Opret en ny express applikation
const app = express();

// Logger alle requests til serveren
app.use(morgan("dev"));
//Brug layouts
app.use(expressLayouts);

app.use(bodyParser.urlencoded({extended: true}));

// Middleware til at tjene statiske filer fra 'public' mappen
app.use(express.static(PATH.join(__dirname, "public")));

// Indstil EJS som view engine
app.set("view engine", "ejs");
// Her antager vi, at dine views ligger i en mappe kaldet 'views' inden i din projektmappe
app.set("views", PATH.join(__dirname, "../views"));

app.get('/login', (req, res, next) => {
  try {
      res.render("login");    
  } catch (error) {
      next(error);
  }
});

app.post('/login', (req, res, next) => {
  // get submitted username and password
  let { username, password } = req.body;
  // Read users from json file
  let users = JSON.parse(fs.readFileSync(adminFilePath, 'utf-8'));
  // Find username and check password
  const user = users.find(u => u.username === username && u.password === password);
  console.log(user);
  // Error if user not found
  if (!user) {next(new Error("Username or Password is wrong"));}
  let time = new Date().toLocaleString();
  users[user.id-1].timeLogs.push(time);
  console.log(time);
  fs.writeFileSync(adminFilePath, JSON.stringify(users, null, 2));

  //, { userData }
  res.render('quiz');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error' + err);
});

// Importer routes fra routes.js
const routes = require("./routes");

// Brug dine routes med app
app.use(routes);

// Start serveren
app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});
