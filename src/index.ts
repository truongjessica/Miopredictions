#!/usr/bin/env node

// Imports
import * as admin from 'firebase-admin';
import * as csv from 'csvtojson';
import * as fs from 'fs-extra';
//command line prompt
import * as args from 'commander';

//essentially how we call our commands e.g npm firebase -s + description, argv simply states that its an argument from the terminal (C/C++ similarities)
//args is for arguments, argv is for argument value, args
args.version("0.0.1").option("-s, --src <path>", "Source file path")
    .option("-c, --collection <path>", "Collection path in database").option("-i, --id[id]", "Field to use for Document ID").parse(process.argv);

let serviceAccount = require("../credentials.json");
//Authenticates that we are the correct devs, similar to database.js except safer
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)

})
//Now
const db = admin.firestore();

//takes command line arguments
async function migrate() {
    try {
        //arguments user passes into the terminal
        const colPath = args.collection;
        const file = args.src;
        //No file / if colPath == null
        if (!colPath || !file) {
            return Promise.reject("Missing required data");
        }
        else {
            const colRef = db.collection(colPath);
            //if one update fails, all of them do  
            const batch = db.batch();
            let data;
            if (file.includes(".json")) {
                //will parse the json file into a javascript object
                data = await fs.readJSON(file);
            }
            if (file.includes(".csv")) {
                data = await readCSV(file);
            }
            //if its a csv
            //of not in because we are looping through objects
            for (const item of data) {
                //basically if the user put an id, or else generate a random one
                const id = args.id ? item[args.id].toString() : colRef.doc().id
                const docRef = colRef.doc(id);
                batch.set(docRef, item);
            }
            await batch.commit();
            console.log("migration was a success")

        }

    } catch (error) {
        console.log("Migration failed");
    }
    //read the csv file
    function readCSV(path): Promise<any> {
        return new Promise((resolve, reject) => {
            let lineCount = 0;
            csv().fromFile(path).on("json", data => {
                lineCount++;
            }).on("endP_parsed", data => {
                console.info('csv complete ${lineCount} row parsed');
                resolve(data)
            }).on("error", err => reject(err))
        })
    }
}
migrate();

//run