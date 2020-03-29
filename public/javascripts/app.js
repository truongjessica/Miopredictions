//IIFE
(function () {

    let result = document.getElementById("startDD");
    document.getElementById('startDD').onclick = function () {
        let val = document.getElementById("startDDVal");
        val.innerHTML = result.innerHTML;
        console.log(result.innerHTML);


    };
}

)();
