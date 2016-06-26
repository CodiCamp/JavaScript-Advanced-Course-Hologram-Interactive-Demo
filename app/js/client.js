(function () {

    if (!localStorage._id) {
        localStorage._id = Date.now();
    }

    gyro.startTracking(function(o) {
        // var b = document.getElementById('example'),
        //     f = document.getElementById('features');
        //
        // f.innerHTML = gyro.getFeatures();
        // b.innerHTML = "<p> x = " + o.x.toFixed(2) + "</p>" +
        //     "<p> y = " + o.y + "</p>" +
        //     "<p> z = " + o.z + "</p>" +
        //     "<p> alpha = " + o.alpha + "</p>" +
        //     "<p> beta = " + o.beta + "</p>" +
        //     "<p> gamma = " + o.gamma + "</p>" +
        //     "<p> id = " + localStorage._id + "</p>";
    });

    var status = document.getElementById('status');

    var str = {coord:[0,0], test:"test"};
    var coords = str.coord;

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        console.log('WebSocket not supported');
        return;
    }

    var connection = new WebSocket('ws://127.0.0.1:1337');

    connection.onopen = function () {
        status.innerHTML = 'You are in control';
    };

    connection.onerror = function (error) {
        console.log('Connection error! Server down?');
    };

    document.onkeydown = function(e) {
        if (e.keyCode === 39) {
            coords[0] += 10;
        }
        else if (e.keyCode === 37) {
            coords[0] -= 10;
        }

        if (e.keyCode === 38) {
            coords[1] -= 10;
        }
        else if (e.keyCode === 40) {
            coords[1] += 10;
        }
        connection.send(JSON.stringify(str));
    };
})();