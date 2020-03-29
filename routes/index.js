var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('selectTown', { title: 'Select Town' });
});


router.get('/intersection', function(req, res, next) {
  res.render('intersection', { title: 'Intersection' });
});



router.get('/results', function(req, res, next) {
  res.render('results', { title: 'Hello' });
});

module.exports = router;
