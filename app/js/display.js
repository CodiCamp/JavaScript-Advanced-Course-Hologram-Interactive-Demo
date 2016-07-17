(function () {

    var box = document.getElementById('box');
    var connection = new WebSocket('ws://192.168.0.123:1337');
    var fishTemplate = '<div class="top_fin"></div><div class="tail_fin"></div> <div class="fish_body"><div class="eye"></div><div class="scale_1"></div><div class="scale_2"></div><div class="scale_3"></div><div class="scale_4"></div></div>';
    var clients = {};
    var surfacePlaceholders = [];
    var displayData = [];

    for(var i = 1; i<5; i++){
        surfacePlaceholders.push(document.getElementById('placeholder-' + i));
    }

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        console.log('WebSocket not supported');
        return;
    }

    if (!localStorage._displayId) {
        localStorage._displayId = Date.now();
    }

    connection.onopen = function () {
        displayData = ['display', localStorage._displayId];
        connection.send(displayData);
    };

    connection.onerror = function (error) {
        console.log('Connection error! Server down?');
    };

    connection.onmessage = function (str) {

        try {
            var data = JSON.parse(str.data);
            // var message  = JSON.parse(data.data.text);
            // console.log(message);

            if(!clients[data._id]) {

                spawnFish(data);

            }else {

                updateFishPosition(data);
            }

        } catch (e) {
            var data = JSON.parse(str.data);

            console.error(data);
        }
    };

    /**
     * Creates HTML Fish instance
     * @param fishData
     */
    function spawnFish(fishData) {
        console.log('spawn fish', fishData);
        clients[fishData._id] = fishData;
        clients[fishData._id].fishObjects = [];

        surfacePlaceholders.forEach(function (surface, index) {
            var fishWrapper = document.createElement('div');
            fishWrapper.classList.add('fred');
            fishWrapper.classList.add(fishData._id);
            fishWrapper.innerHTML = fishTemplate;

            clients[fishData._id].fishObjects.push(fishWrapper);

            surface.appendChild(fishWrapper);
        });
    }

    function updateFishPosition (fishData) {

        clients[fishData._id].fishObjects.forEach(function (fishObject){
            //TO DO: transformation
            //transform: translate3d(x,y,z);
        });


        clients[fishData._id] = clients[fishData._id].extend(fishData);
    }

})();
