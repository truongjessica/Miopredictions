let fs = require('fs-extra');
let csv = require('csvtojson');

module.exports.displayinfo = (req, res, next) => {


    csv()

        .fromFile(req.params.fileName + ".csv")
        .then(function (jsonArrayObj) { //when parse finished, result will be emitted here.

            var currentDate = new Date();
            //date time



            // console.log(jsonArrayObj[1]);
            // console.log(jsonArrayObj[2]);
            // console.log(jsonArrayObj[3]);


            if (jsonArrayObj != null) {
                res.json({
                    success: true,
                    info: jsonArrayObj
                })
            }
        })

    //Date
    //time (without the date)

};
//read the csv file


