/**
 * Created by strawmanbobi
 * 2017-02-06
 */

var contentWindow = null;
var connectionId = -1;

chrome.app.runtime.onLaunched.addListener(function () {

    if (http.Server && http.WebSocketServer) {
        // listen for HTTP connections.
        var server = new http.Server();
        var wsServer = new http.WebSocketServer(server);
        server.listen(8301);

        console.log("server listening on port 8301");

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
                    contentWindow = createdWindow.contentWindow;
                    contentWindow.addEventListener('load', function(e) {
                        contentWindow.onLoad();
                    });
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

// serial port operations
function openSerialPort(port) {
    console.log("open serial port " + port);

    if (connectionId != -1) {
        chrome.serial.disconnect(connectionId, openSerialPort);
        return;
    }

    chrome.serial.connect(port, null, onSerialPortOpened);
}

function closeSerialPort() {
    chrome.serial.disconnect(connectionId, onSerialPortClosed);
}

function sendData(str) {
    chrome.serial.send(connectionId, convertStringToArrayBuffer(str), function () {
    });
}


// serial port event handler
function onSerialPortOpened(openInfo) {
    connectionId = openInfo.connectionId;
    if (connectionId == -1) {
        setStatus('Could not open');
        return;
    }
    contentWindow.onSerialPortOpened(openInfo);
}

function onSerialPortClosed() {
    connectionId = -1;
    contentWindow.onSerialPortClosed();
}