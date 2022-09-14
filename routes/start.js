var express = require("express");
var router = express.Router();

/* GET Befehl. */
router.get("/", function (req, res, next) {
  res.render("start", { title: "Startseite" });
});

module.exports = router;