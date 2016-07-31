(function () {

    var box = document.getElementById('box');
    var connection = new WebSocket('ws://192.168.0.123:1337');
    var fishTemplate = '<div class="top_fin"></div>' +
        '<div class="tail_fin"></div> ' +
        '<div class="fish_body">' +
        '<div class="eye"></div>' +
        '<div class="scale_1"></div>' +
        '<div class="scale_2"></div>' +
        '<div class="scale_3"></div>' +
        '<div class="scale_4"></div>' +
        '</div>';
    var clients = {};
    var surfacePlaceholders = [];
    var displayData = [];
    var initialFishCoords = {};
    var movement = {
        horizontal: 0,
        vertical: 0
    };

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
        initialFishCoords = {};
        clients[fishData._id] = fishData;
        clients[fishData._id].fishObjects = [];

        if (typeof fishData.alpha !== 'undefined') {
            initialFishCoords.horizontal = fishData.alpha;
            initialFishCoords.vertical = fishData.beta;

        } else {
            initialFishCoords.horizontal = fishData.x;
            initialFishCoords.vertical = fishData.y;
        }

        surfacePlaceholders.forEach(function (surface, index) {
            var fishWrapper = document.createElement('div');
            fishWrapper.classList.add('fred');
            fishWrapper.classList.add(fishData._id);
            fishWrapper.innerHTML = fishTemplate;

            clients[fishData._id].fishObjects.push(fishWrapper);

            surface.appendChild(fishWrapper);
        });
    }

    function updateFishPosition (fishData, rotated) {
        setTimeout(function() {

            if (typeof fishData.alpha !== 'undefined') {
                movement.horizontal = fishData.alpha;
                movement.vertical = fishData.beta;

            } else {
                movement.horizontal = fishData.x;
                movement.vertical = fishData.y;
            }

            if (fishData.orientation === 'landscape') {
                movement.horizontal = movement.horizontal + movement.vertical - movement.horizontal;
                movement.vertical = movement.vertical + movement.horizontal - movement.vertical;
            }

            var movementAlteration = {
                x: (initialFishCoords.horizontal - movement.horizontal)/10,
                y: (initialFishCoords.vertical - movement.vertical)/10
            }

            clients[fishData._id].fishObjects.forEach(function (fishObject){
                fishObject.style.transform = 'translate('+movementAlteration.x*10+'px,'+movementAlteration.y*10+'px)';
            });


        }, 100);

        clients[fishData._id] = clients[fishData._id].extend(fishData);
    }

})();
