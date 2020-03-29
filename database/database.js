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

var myDB_getTravelTime = function(startCity, endCity, startInt, endInt, time, callback) {
    console.log('Getting average time of' + startInt + ' to ' + endInt + ' at '+ time);
    var source = db.collection(startCity);
    var results = null;
    //check var names w Jason; can i compare time stamps like that? 

    source.where("startLocation", "==", startInt).where("destination", "==", endInt)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var document = doc.data();
                var startofPeriod = doc.get("startTime");   //start of 15 minute time period    
                var endOfPeriod = doc.get("endTime");   //end of 15 minute time period

                if (startTime <= time && endTime >= time) {     //if the time the person is travelling is within this binned interval....
                    console.log('success');
                    console.log(doc.id, " => ", document);
                    results = doc.get("traveltime");
                }
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });    

   callback(results, null);
}

//var source = db.collection("testcity");
//myDB_getTravelTime("CityA", "CityB", "Dorchester Road and Huron Church Road", "Grand Blvd W and Jeffries Fwy SSD", new firebase.firestore.Timestamp.now());


var database = {
    getTravelTime: myDB_getTravelTime
}

module.exports = database;
