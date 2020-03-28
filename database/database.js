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