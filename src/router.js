var express = require("express");
var path = require("path");
var router = express.Router();
const fs = require('fs');

const adminFilePath = path.join(__dirname, "./data/admin.json");
const userFilePath = path.join(__dirname, "./data/users.json");
const xmlFilePath = path.join(__dirname, "./xml");

// login admin
router.post("/login", (req, res) => {
    let { username, password } = req.body;
    let admins = JSON.parse(fs.readFileSync(adminFilePath, 'utf-8'));
    // Find username and check password
    const admin = admins.find(a => a.username === username && a.password === password);
    // Error if user not found
    if (!admin) {
        res.end("Invalid Username")
    } else {
        req.session.user = admin.username;
        //res.end("login succesfuld")
        res.redirect("/route/adminpanel");
    }
}) 

// Login User
router.post("/user", (req, res) => {
    let { referalcode } = req.body;
    let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
    // Find username and check password
    const user = users.find(u => u.referalcode === referalcode);
    // Error if user not found
    if (!user) {
        res.end("Invalid Code")
    } else {
        req.session.user = user.referalcode;
        res.redirect("/route/dashboard");
    }
}) 

router.get("/adminpanel", (req, res) =>{
    if(req.session.user){
        fs.readdir(xmlFilePath, (err, files) => {
            if(err) {
                console.error('Error reading folder:', err);
                res.status(500).send('Error reading folder');
                return;
            }
            res.render("adminpanel", {user:req.session.user, files})
        })
        
    } else {
        res.send("Unauthorized User")
    }
})

router.post("/upload", (req, res) =>{
    if(req.session.user){
        if (!req.files || !req.files.file) {
            res.status(400).send('No file uploaded.');
            return;
        }
    
        const file = req.files.file;
        const fileName = file.name;
        const filePath = path.join(__dirname, "./xml", fileName);
    
        // Check if the file extension is XML
        if (path.extname(fileName).toLowerCase() !== '.xml') {
            fs.unlinkSync(file.tempFilePath); // Delete the file if it's not XML
            res.status(400).send('Only XML files are allowed.');
            return;
        }
    
        // Move the file to the folder
        file.mv(filePath, (err) => {
            if (err) {
                console.error('Error uploading file:', err);
                res.status(500).send('Error uploading file.');
                return;
            }
            res.redirect('/adminpanel');
        });
        
    } else {
        res.send("Unauthorized User")
    }
})

router.get("/dashboard", (req, res) =>{
    if(req.session.user){
        res.render("dashboard", {user:req.session.user})
    } else {
        res.send("Invalid Code")
    }
})

// Logout
router.get("/logout", (req, res) =>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error");
        } else {
            res.render("index", {title: "Login",  logout:"Logout Succesfully!"})
        }
    })
})


module.exports = router;