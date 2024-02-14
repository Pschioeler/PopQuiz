const express = require('express');
const path = require('path');
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const {v4:uuidv4} = require("uuid");
const app = express();
const port = 3000;
const router = require("./router");
const bodyParser = require('body-parser');

app.use(cors());
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended: true}));

// Static Files aka css
app.use(express.static(path.join(__dirname, "../public")));
app.use("/css", express.static(__dirname + "public/css"));


// Initialesere engine
app.set('view engine', 'ejs');
// Set views
app.set('views', "./views");
// Use session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

app.use("/route", router);

app.get('/', (req, res) => {
    try {
        res.render("index", {title: "Login System"});
    } catch (error) {
        next(error);
    }
});

app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});