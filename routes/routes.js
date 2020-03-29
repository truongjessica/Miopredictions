var express = require('express');
//var db = require('../database/database.js'); once we set it up

/* GET home page. */
var getHomePage = function (req, res, next) {
  res.render('index', { title: 'Express' });
};

/* GET users listing. */
var getUsersListing = function (req, res, next) {
  res.send('respond with a resource');
};


// Given startplace, endplace, time, get predicted travel time (alrdy computed)

var postPredictedTime = function (req, res, next) {
  var startCity = req.body.startcity;
  var start = req.body.start;
  var endCity = req.body.endCity;
  var end = req.body.end;
  var time = req.body.time;


}

var routes = {
  get_homepage: getHomePage,
  get_userslisting: getUsersListing,
  postPredictedTime: postPredictedTime

}

module.exports = routes;
