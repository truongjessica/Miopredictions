var express = require('express');
var router = express.Router();

let dataController = require("../controllers/data");

/* GET home page. */


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('selectTown', { title: 'Select Town' });
});


router.get('/intersection', function (req, res, next) {
  res.render('intersection', { title: 'Intersection' });
});



router.get('/results', function (req, res, next) {
  res.render('results', { title: 'Hello' });
});



router.get("/api/:fileName", dataController.displayinfo);
//router.get("/averageResult", dataController.displayAverage);


module.exports = router;
