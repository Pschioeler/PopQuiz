// Importer express og path modulerne
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

// Opret en ny express applikation
const app = express();

// Logger alle requests til serveren
app.use(morgan("dev"));
//Brug layouts
app.use(expressLayouts);

// Definer en port vi vil lytte på
const PORT = process.env.PORT || 8900;

// Middleware til at tjene statiske filer fra 'public' mappen
app.use(express.static(path.join(__dirname, "public")));

// Indstil EJS som view engine
app.set("view engine", "ejs");
// Her antager vi, at dine views ligger i en mappe kaldet 'views' inden i din projektmappe
app.set("views", path.join(__dirname, "../views"));

// Importer routes fra routes.js
const routes = require("./routes");

// Brug dine routes med app
app.use(routes);

// Start serveren
app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});
