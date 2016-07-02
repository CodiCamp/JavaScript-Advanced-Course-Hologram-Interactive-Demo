var webSocketsServerPort = 1337;
var webSocketServer = require('websocket').server;
var http = require('http');

var clients = [ ];
var displays = [ ];
var displayIndex = [ ];

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
            console.log(displayIndex);
        }
        else {
            clientIndex = clients.push(connection) - 1;
            for (var i=0; i < clients.length; i++) {
                clients[i].send(json);
            }
        }
    });

    connection.on('close', function(message) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            delete displays[connection.id];
            var index = displayIndex.indexOf(connection.id);
            displayIndex.splice(index, 1);
            console.log(displayIndex);
    });
});;