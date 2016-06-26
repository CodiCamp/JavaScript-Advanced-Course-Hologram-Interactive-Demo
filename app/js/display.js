(function () {

    //var coords = [];
    var testObj = [];
    var box = document.getElementById('box');

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    if (!window.WebSocket) {
        console.log('WebSocket not supported');
        return;
    }

    var connection = new WebSocket('ws://192.168.0.113:1337');

    connection.onerror = function (error) {
        console.log('Connection error! Server down?');
    };

    connection.onmessage = function (str) {
        try {
            var json = JSON.parse(str.data);
        } catch (e) {
            console.log('JSON not valid', str.data);
            return;
        }

        if (json.type === 'message') {
            addMessage(json.data.text);
        }
        else {
            console.log('Strange JSON', json);
        }
    };

    function addMessage(string) {
        testObj = string;
        testObj = JSON.parse(testObj);
        box.style.left = testObj.coord[0] + 'px';
        box.style.top = testObj.coord[1] + 'px';
        console.log(testObj);
    }

    var template = '<div class="fish_wrap"><div class="fred"><div class="top_fin"></div><div class="tail_fin"></div> <div class="fish_body"><div class="eye"></div><div class="scale_1"></div><div class="scale_2"></div><div class="scale_3"></div><div class="scale_4"></div></div></div></div>';
})();