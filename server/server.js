var webSocketsServerPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');

var clients = { };
var displays = { };
var displayIndex = [ ];
var clientIndex = [ ];

var server = http.createServer(function(request, response) {});

server.listen(webSocketsServerPort, function() {
    console.log("Server is listening on port " + webSocketsServerPort);
});

var wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);

    connection.id = 0;

    console.log((new Date()) + ' Connection accepted.');
    console.log(connection.id);
    connection.on('message', function(message) {
        console.log((new Date()) + ' Received: ' + message.utf8Data);

        var json = JSON.stringify(message.utf8Data);
        if(json.indexOf('display') > -1) {
            connection.type = json.split(',')[0];
            connection.id = json.split(',')[1];
            displays[connection.id] = connection;
            displayIndex.push(connection.id);
        }
        else {
            json = JSON.parse(message.utf8Data);
            if(clientIndex.indexOf(json._id) < 0){
                connection.type = json.type;
                connection.id = json._id;
                clients[connection.id] = connection;
                clientIndex.push(connection.id);
                console.log(clientIndex);
            }
            for (var key in displays) {
                displays[key].send(JSON.stringify(json));
            }
        }
    });

    connection.on('close', function(message) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");

        if (clientIndex.indexOf(JSON.stringify(connection.id))) {
            delete clients[connection.id];
            var index = clientIndex.indexOf(connection.id);
            clientIndex.splice(index, 1);
        }
        else if (displayIndex.indexOf(JSON.stringify(connection.id))) {
            delete displays[connection.id];
            var index = displayIndex.indexOf(connection.id);
            displayIndex.splice(index, 1);
        }
    });
});;