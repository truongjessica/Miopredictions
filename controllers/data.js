let fs = require('fs-extra');
let csv = require('csvtojson');

module.exports.displayinfo = (req, res, next) => {


    csv()

        .fromFile(req.params.fileName + ".csv")
        .then(function (jsonArrayObj) { //when parse finished, result will be emitted here.

            var currentDate = new Date();
            //date time

            for (var i = 0; i < jsonArrayObj.length; i++) {
                delete jsonArrayObj[i]['Source_ID'];
                delete jsonArrayObj[i]['Destination_ID'];
                delete jsonArrayObj[i]['seconds average'];


            }



            let arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            for (let i = 0; i < jsonArrayObj.length; i++) {
                let dateSplit = jsonArrayObj[i].Start_time.split(" ");
                let dateSplit2 = jsonArrayObj[i].End_time.split(" ");
                jsonArrayObj[i].Start_time = dateSplit[1]
                jsonArrayObj[i].End_time = dateSplit2[1]
                jsonArrayObj[i].Date = dateSplit[0];

                let date = dateSplit[0].split("-");
                console.log(date[0] + " " + date[1] + "  " + date[2]);
                let readableDate = new Date(parseInt(date[0], 10), parseInt(date[1], 10) - 1, parseInt(date[2], 10))
                console.log(readableDate.getDay());
                let num = readableDate.getDay();
                jsonArrayObj[i].day = arr[num];
                jsonArrayObj[i].average = 0


                // jsonArrayObj[i].day = dateFormat.getDate()

            }

            console.log(jsonArrayObj[1]);
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


