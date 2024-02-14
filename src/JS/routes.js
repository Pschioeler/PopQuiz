const express = require("express");
const router = express.Router();
const processXML = require('../modules/processXML.js');
const adminController = require("../modules/admin.js");
const validateAnswersAndScore = require('../modules/sessionscore.js');

router.use(processXML);

router.get("/", (req, res) => {
  res.render("index", { title: "Hjem" });
});

// Handle form submission
router.post('/submit', (req, res) => {
  const userAnswer = req.body.answer;
  const correctAnswers = req.body.korrekteSvar;
  const question = req.body.question;
  validateAnswersAndScore(userAnswer, correctAnswers);
});

router.get("/admin/upload", (req, res) => {
  res.render("admin/upload", { title: "Upload XML" });
});

router.get("/admin/view", (req, res) => {
  res.render("admin/view", { title: "All XML" });
});

router.get('/quiz', (req, res) => {
  res.render("quiz", {questions: req.questions});
});

// Admin-relaterede routes
router.get("/admin", adminController.index);
router.post("/admin/upload", adminController.uploadXML);
// router.get("/admin/view", adminController.viewXML);
router.post("/admin/delete", adminController.deleteXML);

module.exports = router;
