var express = require("express");
var router = express.Router();

/* GET Befehl. */
router.get("/", function (req, res, next) {
  res.render("impressum", { title: "Impressum" });
});

module.exports = router;