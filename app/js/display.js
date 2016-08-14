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
    var executionTime = (new Date()).getTime();

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

            } else {

                updateFishData(data);
            }

        } catch (e) {
            var data = JSON.parse(str.data);

            console.error(data);
        }
    };

    draw();

    function normalizeData(fishData){

        var denominator = 0,
            rotX = 0,
            rotY = 0;

        if (fishData.hasGyro) {
            denominator = 14;
        } else {
            denominator = 0.1;
        }

        rotX = (fishData.initialFishCoords.horizontal - fishData.current.horizontal) / denominator;
        rotY = (fishData.initialFishCoords.vertical - fishData.current.vertical) / denominator;

        fishData.movementCoefficient = {
            horizontal: rotX,
            vertical: rotY
        };
    }

    /**
     * Creates HTML Fish instance
     * @param fishData
     */
    function spawnFish(fishData) {

        clients[fishData._id] = fishData;
        clients[fishData._id].fishObjects = [];
        clients[fishData._id].initialFishCoords = {};
        clients[fishData._id].x = 0;
        clients[fishData._id].y = 0;

        if (fishData.hasGyro) {
            clients[fishData._id].initialFishCoords.vertical = fishData.beta;
            clients[fishData._id].initialFishCoords.horizontal = fishData.gamma;

        } else {
            clients[fishData._id].initialFishCoords.horizontal = fishData.x;
            clients[fishData._id].initialFishCoords.vertical = fishData.y;
        }

        clients[fishData._id].current = {
            vertical: clients[fishData._id].initialFishCoords.vertical,
            horizontal: clients[fishData._id].initialFishCoords.horizontal
        };

        normalizeData(clients[fishData._id]);

        surfacePlaceholders.forEach(function (surface, index) {
            var fishWrapper = document.createElement('div');
            fishWrapper.classList.add('fred');
            fishWrapper.classList.add(fishData._id);
            fishWrapper.innerHTML = fishTemplate;

            clients[fishData._id].fishObjects.push(fishWrapper);

            surface.appendChild(fishWrapper);
        });
    }

    function draw () {

        updateFishPosition();
    }

    function updateFishData (fishData) {
        var currentCoords = clients[fishData._id].current;

        if (fishData.hasGyro) {
            currentCoords.horizontal = fishData.gamma;
            currentCoords.vertical = fishData.beta;

        } else {
            currentCoords.horizontal = fishData.x;
            currentCoords.vertical = fishData.y;
        }

        if (fishData.orientation === 'landscape') {
            currentCoords.horizontal = currentCoords.horizontal + currentCoords.vertical - currentCoords.horizontal;
            currentCoords.vertical = currentCoords.vertical + currentCoords.horizontal - currentCoords.vertical;
        }

        normalizeData(clients[fishData._id]);
    }

    /**
     * FN to be looped in RAF
     */
    function updateFishPosition () {
        //24 FPS
        var newTime = new Date().getTime();
        if(newTime - executionTime > 41){

            executionTime = newTime;

            for (var fishData in clients) {

                if(clients.hasOwnProperty(fishData)) {

                    fishData = clients[fishData];

                    clients[fishData._id].fishObjects.forEach(function (fishObject){

                        if (fishData.movementCoefficient.horizontal > 0) {
                           if (fishData.x < document.getElementById('projection').clientWidth) {
                                fishData.x +=  -2 * fishData.movementCoefficient.horizontal;
                           }

                        } else if (fishData.movementCoefficient.horizontal < 0){
                            if (fishData.x > -document.getElementById('projection').clientWidth) {
                                fishData.x += -2 * fishData.movementCoefficient.horizontal;
                            }
                        }

                        fishObject.style.transform = 'translate('+fishData.x+'px,'+fishData.y+'px)';

                    });
                }

            }
        }

        requestAnimationFrame(updateFishPosition);
    }

})();
