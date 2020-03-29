// SET UP DEV ENV

// Add Firebase + Cloud Firestore libs added to app (npm install)
// Manually require Firebase and Cloud Firestore
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// INITIALIZE FS through FB
var firebaseConfig = {
    apiKey: "AIzaSyB8V3IYwqKQRk433SLSIDwlthJt7T2qmbI",
    authDomain: "dataanalysis-e8abe.firebaseapp.com",
    databaseURL: "https://dataanalysis-e8abe.firebaseio.com",
    projectId: "dataanalysis-e8abe",
    storageBucket: "dataanalysis-e8abe.appspot.com",
    messagingSenderId: "442052096901",
    appId: "1:442052096901:web:ff98e8966965bcc1370aec",
    measurementId: "G-C5F0M5CD4S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

//-------------------------------------------------//
var myDB_getTravelTime = function (startCity, startInt, endInt, timeOfDay, callback) {
    console.log('Getting average time of' + startInt + ' to ' + endInt + ' at ' + timeOfDay);
    var source = db.collection(startCity);  //Detroit or Windsor
    var results = null;
    
    source.where("Source_Name", "==", startInt).where("Destination_name", "==", endInt)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var document = doc.data();
                var entryTimeOfDay = doc.get("Time_of_day");   //entry time of day

                if (timeOfDay == entryTimeOfDay) {     //if the time the person is travelling is within this binned interval....
                    console.log('success');
                    console.log(doc.id, " => ", document);
                    avgSecs = doc.get("Travel_time");   //return average in seconds

                    var measuredTime = new Date(null);
                    measuredTime.setSeconds(Math.round(avgSecs)); //convert from double to int
                    var results = measuredTime.toISOString().substr(11, 8);
                    console.log(results);
                    callback(results, null);
                }
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
            callback(null, error);
        });

    //callback(results, null);
}

var findTimeOfDay = function(time, callback) {
    var selection = new Date(time);
    if (selection == null) {
        callback(null, 'thing was null');
    } else {
        var hour = selection.getHours();
        var timeOfDay;
        if (hour >= 0 && hour < 6) { // 12am to 6am late
            timeOfDay = 'late';
        } else if (hour >= 6 && hour < 9) { // 6am to 9am morning
            timeOfDay = 'morning';
        } else if (hour >= 9 && hour < 12) { // 9am to 12pm midMorning
            timeOfDay = 'midMorning';
        } else if (hour >= 12 && hour < 17) { // 12pm to 5pm afternoon
            timeOfDay = 'afternoon';
        } else if (hour >= 17 && hour < 21) { //5pm to 9pm dinner
            timeOfDay = 'dinner';
        } else {                            //night
            timeOfDay = 'night';
        }
        console.log('tod: ' + timeOfDay);
        callback(timeOfDay,null);
    } 
}

//myDB_getTravelTime("Detroit", "Dragoon and Fisher Fwy Ser Drs", "Totten Street and Huron Church Road", "2018-06-12T19:30");
//findTimeOfDay("Detroit", "Dragoon and Fisher Fwy Ser Drs", "Totten Street and Huron Church Road", "2018-06-12T19:30", myDB_getTravelTime);

let database = {
    getTimeOfDay: findTimeOfDay,
    getTravelTime: myDB_getTravelTime
}

module.exports = database;
