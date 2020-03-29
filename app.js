var createError = require('http-errors')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var db = require('./database/database.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/intersection/:id', function (req, res, next) {
  let id = req.params.id;
  let arr = ["Dorchester Road and Huron Church Road", "Totten Street and Huron Church Road", "Malden Road and Huron Church Road"]
  let arr2 = ["Dragoon and Fisher Fwy Ser Drs", "Lafayette Boulevard and Waterman Street", "Grand Blvd W and Jeffries Fwy NSD", "Grand Blvd W and Jeffries Fwy SSD"]

  if (id == "detroit") {

    res.render('intersection',
      {
        title: 'Intersection', dropDown1: arr2, dropDown2: arr
      });
  }
  if (id == "windsor") {
    res.render('intersection',
      {
        title: 'Intersection', dropDown1: arr, dropDown2: arr2
      });
  }
});

app.post('/postTravelTime', function(req, res, next) {
    var startCity = req.body.startcity;
    var startInt = req.body.start;
    var endInt = req.body.end;
    var time = req.body.time;

    db.getTravelTime(startCity, startInt, endInt, time, function(data,err) {
        if (err) {
          res.send(err);
        } else if (data == null) {
          console.log('null');
          res.send ('null');
        } else {
          console.log(data);
          res.send(data);
        }
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
