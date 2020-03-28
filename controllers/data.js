let fs = require('fs-extra');
let csv = require('csvtojson');

module.exports.displayinfo = (req, res, next) => {
    csv()
        .fromFile("test.csv")
        .then(function (jsonArrayObj) { //when parse finished, result will be emitted here.
            if (jsonArrayObj != null) {
                res.json({
                    success: true,
                    info: jsonArrayObj

                })
            }
        })


};
//read the csv file


