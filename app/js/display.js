(function () {

    var box = document.getElementById('box');
    var connection = new WebSocket('ws://127.0.0.1:1337');
    var template = '<div class="fish_wrap"><div class="fred"><div class="top_fin"></div><div class="tail_fin"></div> <div class="fish_body"><div class="eye"></div><div class="scale_1"></div><div class="scale_2"></div><div class="scale_3"></div><div class="scale_4"></div></div></div></div>';

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        console.log('WebSocket not supported');
        return;
    }

    if (!localStorage._displayId) {
        localStorage._displayId = Date.now();
    }

    connection.onerror = function (error) {
        console.log('Connection error! Server down?');
    };

    connection.onopen = function () {
        connection.send('display');
    }

    connection.onmessage = function (str) {
        try {
            var json = JSON.parse(str.data);
        } catch (e) {
            console.log('JSON not valid', str.data);
        }
    };

    connection.onclose = function () {
    }
})();
