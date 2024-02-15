var express = require("express");
var path = require("path");
const multer = require("multer");
var router = express.Router();
const fs = require("fs");
const processXML = require("./modules/processXML.js");
router.use(processXML);
const summaryModule = require("./modules/summary.js");
const { displayAnswers } = require("./modules/summary.js");

const adminFilePath = path.join(__dirname, "./data/admin.json");
const userFilePath = path.join(__dirname, "./data/users.json");
const xmlFilePath = path.join(__dirname, "./xml");

// login admin
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  let admins = JSON.parse(fs.readFileSync(adminFilePath, "utf-8"));
  // Find username and check password
  const admin = admins.find(
    (a) => a.username === username && a.password === password
  );
  // Error if user not found
  if (!admin) {
    res.end("Invalid Username");
  } else {
    req.session.user = admin.username;
    //res.end("login succesfuld")
    res.redirect("/route/adminpanel");
  }
});

// Login User
router.post("/user", (req, res) => {
  let { referalcode } = req.body;
  let users = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));
  // Find username and check password
  const user = users.find((u) => u.referalcode === referalcode);
  // Error if user not found
  if (!user) {
    res.end("Invalid Code");
  } else {
    req.session.user = user.referalcode;
    res.redirect("/route/dashboard");
  }
});

router.get("/adminpanel", (req, res) => {
  if (req.session.user) {
    fs.readdir(xmlFilePath, (err, files) => {
      if (err) {
        console.error("Error reading folder:", err);
        res.status(500).send("Error reading folder");
        return;
      }
      res.render("adminpanel", { user: req.session.user, files });
    });
  } else {
    res.send("Unauthorized User");
  }
});

const upload = multer({
  dest: "xml/",
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "text/xml") {
      cb(new Error("Kun XML filer er tilladt"), false);
    } else {
      cb(null, true);
    }
  },
}).single("xmlFile");

router.post("/upload", (req, res) => {
  if (req.session.user) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(500).send("Multer fejl ved upload");
        console.log(err);
      } else if (err) {
        res.status(500).send("Server fejl ved upload");
      } else {
        // Flyt fil fra midlertidig opbevaring til endelig destination
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./xml", req.file.originalname);

        fs.rename(tempPath, targetPath, function (err) {
          if (err) return res.status(500).send("Fejl ved flytning af fil");

          res.redirect("./adminpanel");
        });
      }
    });
  } else {
    res.send("Unauthorized User");
  }
});

router.post("/delete/:fileName", (req, res) => {
  if (req.session.user) {
    const filePath = path.join(__dirname, "./xml", req.params.fileName);
    fs.unlink(filePath, function (err) {
      if (err) {
        console.error("Fejl ved sletning af fil:", err);
        res.status(500).send("Fejl ved sletning af fil");
      } else {
        // Omdiriger tilbage til adminpanelet efter succesfuld sletning
        res.redirect("/route/adminpanel");
      }
    });
  } else {
    res.send("Unauthorized User");
  }
});

router.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", {
      user: req.session.user,
      questions: req.questions,
    });
  } else {
    res.send("Invalid Code");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render("index", { title: "Login", logout: "Logout Succesfully!" });
    }
  });
});

//create a route to access summery.ejs
router.get("/summary", async (req, res) => {
  if (req.session.user) {
    try {
      // Hent svar ved hjælp af displayAnswers funktionen
      const answers = summaryModule.displayAnswers();
      // Send svar data til visningen
      res.render("summary", { user: req.session.user, answers: answers });
    } catch (error) {
      console.error("Fejl ved hentning af svar:", error);
      res.status(500).send("Fejl ved hentning af svar");
    }
  } else {
    res.send("Invalid Code");
  }
});

module.exports = router;
