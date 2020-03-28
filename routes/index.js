var express = require('express');
var router = express.Router();

let dataController = require("../controllers/data");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get("/api", dataController.displayinfo);


module.exports = router;
