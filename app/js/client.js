(function () {

    var status= document.getElementById('status');

        window.WebSocket = window.WebSocket || window.MozWebSocket;

        var connection = new WebSocket('ws://192.168.0.123:1337');

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
            coords._id = localStorage._id;

            for (var coord in coords) {
                coords[coord] = parseFloat(coords[coord]).toFixed(3);
            }

            connection.send(JSON.stringify(coords));
        });
})();