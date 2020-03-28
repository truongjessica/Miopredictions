#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var admin = require("firebase-admin");
var csv = require("csvtojson");
var fs = require("fs-extra");
//command line prompt
var args = require("commander");
//essentially how we call our commands e.g npm firebase -s + description, argv simply states that its an argument from the terminal (C/C++ similarities)
//args is for arguments, argv is for argument value, args
args.version("0.0.1").option("-s, --src <path>", "Source file path")
    .option("-c, --collection <path>", "Collection path in database").option("-i, --id[id]", "Field to use for Document ID").parse(process.argv);
var serviceAccount = require("../credentials.json");
//Authenticates that we are the correct devs, similar to database.js except safer
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
//Now
var db = admin.firestore();
//takes command line arguments
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var colPath, file, colRef, batch, data, _i, data_1, item, id, docRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    colPath = args.collection;
                    file = args.src;
                    if (!(!colPath || !file)) return [3 /*break*/, 1];
                    return [2 /*return*/, Promise.reject("Missing required data")];
                case 1:
                    colRef = db.collection(colPath);
                    batch = db.batch();
                    data = void 0;
                    if (!file.includes(".json")) return [3 /*break*/, 3];
                    return [4 /*yield*/, fs.readJSON(file)];
                case 2:
                    //will parse the json file into a javascript object
                    data = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!file.includes(".csv")) return [3 /*break*/, 5];
                    return [4 /*yield*/, readCSV(file)];
                case 4:
                    data = _a.sent();
                    _a.label = 5;
                case 5:
                    //if its a csv
                    //of not in because we are looping through objects
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        item = data_1[_i];
                        id = args.id ? item[args.id].toString() : colRef.doc().id;
                        docRef = colRef.doc(id);
                        batch.set(docRef, item);
                    }
                    //THIS WILL NOT COMMIT IF THE FILE IS TOO BIG!
                    return [4 /*yield*/, batch.commit()];
                case 6:
                    //THIS WILL NOT COMMIT IF THE FILE IS TOO BIG!
                    _a.sent();
                    console.log("migration was a success");
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.log("Migration failed");
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
//read the csv file
function readCSV(path) {
    return new Promise(function (resolve, reject) {
        csv()
            .fromFile(path)
            .then(function (jsonArrayObj) {
            console.log(jsonArrayObj);
            resolve(jsonArrayObj);
        });
    });
}
migrate();
//run
//# sourceMappingURL=index.js.map