(function () {

    var status= document.getElementById('status');

        window.WebSocket = window.WebSocket || window.MozWebSocket;

        var connection = new WebSocket('ws://127.0.0.1:1337');

        if (!localStorage._id) {
            localStorage._id = Date.now();
        }

        if (!window.WebSocket) {
            status.innerHTML = 'WebSocket not supported';
            return;
        }

        connection.onopen = function () {
            status.innerHTML = 'You are in control';
        };

        connection.onerror = function (error) {
            status.innerHTML = 'Connection error! Server down?';
        };

        gyro.startTracking(function (coords) {
            coords.id = localStorage._id;
            coords.type = 'client';
            for (var coord in coords) {
                coord = parseFloat(coord).toFixed(3);
            }

            connection.send(JSON.stringify(coords));
        });
})();