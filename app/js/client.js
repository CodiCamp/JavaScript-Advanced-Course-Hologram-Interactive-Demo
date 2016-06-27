(function () {

    if (gyro.hasFeature('devicemotion')) {

        var status = document.getElementById('status');
        var connection = new WebSocket('ws://127.0.0.1:1337');

        if (!localStorage._id) {
            localStorage._id = Date.now();
        }

        window.WebSocket = window.WebSocket || window.MozWebSocket;

        if (!window.WebSocket) {
            console.log('WebSocket not supported');
            return;
        }

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