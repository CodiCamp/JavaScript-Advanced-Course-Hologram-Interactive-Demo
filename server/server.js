var webSocketsServerPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');

var clients = [ ];
var displays = [ ];

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

    var displayIndex = [ ];
    var clientIndex = [ ];
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        console.log((new Date()) + ' Received: ' + message.utf8Data);

        var obj = {
                    time: (new Date()).getTime(),
                    text: message.utf8Data,
                };

        var json = JSON.stringify({ type:'message', data: obj });
        if(json = 'display') {
            displayIndex = displays.push(connection) - 1;
        }
        else {
            clientIndex = clients.push(connection) - 1;
            for (var i=0; i < clients.length; i++) {
                clients[i].send(json);
            }
        }
    });

    connection.on('close', function(connection) {
            console.log(connection);
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            clients.splice(clientIndex, 1);
    });
});