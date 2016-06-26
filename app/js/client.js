(function () {
    if (gyro.hasFeature('devicemotion')) {
        if (!localStorage._id) {
            localStorage._id = Date.now();
        }

        window.WebSocket = window.WebSocket || window.MozWebSocket;

        if (!window.WebSocket) {
            console.log('WebSocket not supported');
            return;
        }

        var connection = new WebSocket('ws://192.168.0.108:1337');

        connection.onopen = function () {
            status.innerHTML = 'You are in control';
        };

        connection.onerror = function (error) {
            console.log('Connection error! Server down?');
        };

        gyro.startTracking(function(coords) {
            coords._id = localStorage._id;
            connection.send(JSON.stringify(coords));
        });
    }
})();