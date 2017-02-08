/**
 * Created by strawmanbobi
 * 2017-02-06
 */

var connectionId = -1;

chrome.app.runtime.onLaunched.addListener(function () {

    if (http.Server && http.WebSocketServer) {
        // listen for HTTP connections.
        var server = new http.Server();
        var wsServer = new http.WebSocketServer(server);
        server.listen(8301);
        console.log('server listening on port 8301');

        // a list of connected websockets
        var connectedSockets = [];

        wsServer.addEventListener('request', function(req) {
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
                    createdWindow.contentWindow.addEventListener('load', function(e) {
                        createdWindow.contentWindow.onLoad();
                    });
                });

            socket.addEventListener('message', function(e) {
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

// app window <-> background message handler
function sendResponse(response, payload) {
    chrome.runtime.sendMessage({ response : response, payload : payload });
}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.request == 'open_port') {
            openSerialPort(message.payload.path, message.payload.options);
        }
        else if (message.request == 'close_port') {
            closeSerialPort();
        }
    });

// serial port operations
function openSerialPort(port, options) {
    if (connectionId != -1) {
        chrome.serial.disconnect(connectionId, openSerialPort);
        return;
    }

    chrome.serial.connect(port, options, onSerialPortOpened);
}

function closeSerialPort() {
    chrome.serial.disconnect(connectionId, onSerialPortClosed);
}

function sendToSerialPort(buffer) {
    chrome.serial.send(connectionId, buffer, null);
}

// serial port event handler
function onSerialPortOpened(openInfo) {
    connectionId = openInfo.connectionId;
    if (connectionId == -1) {
        sendResponse('port_open_failed', openInfo);
        return;
    }
    chrome.serial.onReceive.addListener(onSerialPortReceived);
    sendResponse('port_opened', openInfo);
}

function onSerialPortClosed() {
    connectionId = -1;
    sendResponse('port_closed');
}

function onSerialPortReceived(readInfo) {
    if (-1 != readInfo.connectionId && readInfo.connectionId == connectionId) {
        sendDataToSocket(readInfo.data);
    } else {
        console.log('receive error : ' + readInfo.connectionId);
    }
}

// socket operation
function sendDataToSocket(data) {
    ws.send(data);
}

// socket event handle
function onSocketData(data) {
    if (data.constructor === ArrayBuffer) {
        sendToSerialPort(data);
    } else if ('string' == typeof data) {
        sendToSerialPort(str2ab(data));
    } else {
        alert('type error : ' + typeof data);
    }
}

// utils
function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
