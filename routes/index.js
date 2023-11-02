var express = require('express');
const {join} = require("path");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(join(process.cwd(), "build/index.html"));
});

module.exports = router;
