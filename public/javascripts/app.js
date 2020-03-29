//IIFE
(function () {

    for (let i = 0; i < document.length; i++) {

    }
    let result = document.getElementsByClassName("start");
    for (let i = 0; i < result.length; i++) {

        document.getElementById('startDD' + i).onclick = function () {
            let val = document.getElementById("startDDVal");
            let ok = document.getElementById("startDD" + i);
            val.innerHTML = ok.innerHTML;
            let start = document.getElementById("inputStart");
            start.value = val.innerHTML.toString();
            console.log(start.value);

        }

    };

    let results = document.getElementsByClassName("end");

    for (let i = 0; i < results.length; i++) {

        document.getElementById('endDD' + i).onclick = function () {
            let vals = document.getElementById("endDDVal");
            let oks = document.getElementById("endDD" + i);
            vals.innerHTML = oks.innerHTML;
            let ends = document.getElementById("inputEnd");
            ends.value = vals.innerHTML.toString();
            console.log(ends.value);

            // console.log(result.innerHTML);
        }

    };

}

)();
