/**
 * Created by strawmanbobi
 * 2017-02-06
 */

chrome.app.runtime.onLaunched.addListener(function () {

    if (http.Server && http.WebSocketServer) {
        // listen for HTTP connections.
        var server = new http.Server();
        var wsServer = new http.WebSocketServer(server);
        server.listen(8301);

        console.log("server listening on port 8301");

        /*
        server.addEventListener('request', function(req) {
            var url = req.headers.url;
            if (url == '/')
                url = './index.html';
            // serve the pages of this chrome application
            req.serveUrl(url);
            return true;
        });
        */

        // a list of connected websockets
        var connectedSockets = [];

        wsServer.addEventListener('request', function(req) {
            console.log('client connected');
            var socket = req.accept();
            connectedSockets.push(socket);

            // display serial port connection window on websocket connected
            chrome.app.window.create('index.html', {
                bounds: {
                    top: 20,
                    left: 20,
                    width: 400,
                    height: 320
                }},
                function(createdWindow) {
                    chrome.runtime.sendMessage({'method': 'socket_connected'});
                });

            socket.addEventListener('message', function(e) {
                console.log(e.data);
                onSocketData(e.data);
            });

            // when a socket is closed, remove it from the list of connected sockets
            socket.addEventListener('close', function() {
                console.log('client disconnected');
                for (var i = 0; i < connectedSockets.length; i++) {
                    if (connectedSockets[i] == socket) {
                        connectedSockets.splice(i, 1);
                        break;
                    }
                }
            });
            return true;
        });
    }
});
