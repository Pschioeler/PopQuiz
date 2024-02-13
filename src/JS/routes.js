const express = require("express");
const router = express.Router();

const adminController = require("../modules/admin.js");

router.get("/", (req, res) => {
  res.render("index", { title: "Hjem" });
});

router.get("/admin/upload", (req, res) => {
  res.render("admin/upload", { title: "Upload XML" });
});

router.get("/admin/view", (req, res) => {
  res.render("admin/view", { title: "All XML" });
});

// Admin-relaterede routes
router.get("/admin", adminController.index);
router.post("/admin/upload", adminController.uploadXML);
// router.get("/admin/view", adminController.viewXML);
router.post("/admin/delete", adminController.deleteXML);

module.exports = router;
