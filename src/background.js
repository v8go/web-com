/**
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2017 Strawmanbobi
 **/

var connectionId = -1;
var serialPath = '';
var socket;
var socketConnected = false;
var serialPortOpened = false;
var windowOpened = false;

chrome.app.runtime.onLaunched.addListener(function () {
    initSocket();
    chrome.runtime.onMessage.addListener(onLocalEventReceived);
    chrome.serial.onReceive.addListener(onSerialPortReceived);
});

function initSocket() {
    if (http.Server && http.WebSocketServer) {
        var server = new http.Server();
        var wsServer = new http.WebSocketServer(server);
        server.listen(8301);
        console.log('server listening on port 8301');

        wsServer.addEventListener('request', function(req) {
            if (!socketConnected) {
                socket = req.accept();
                socketConnected = true;
                console.log('client connected');

                socket.addEventListener('message', function(e) {
                    onSocketData(e.data);
                });

                socket.addEventListener('close', function() {
                    console.log('client disconnected');
                    socketConnected = false;
                    closeSerialPort();
                });
            } else {
                console.log('server socket is already connected');
            }
            if (!windowOpened) {
                chrome.app.window.create('connection.html', {
                        bounds: {
                            top: 20,
                            left: 20,
                            width: 400,
                            height: 320
                        },
                        singleton: true
                    },
                    function(createdWindow) {
                        createdWindow.contentWindow.addEventListener('load', function(e) {
                            createdWindow.contentWindow.onLoad();
                        });
                        createdWindow.onClosed.addListener(function() {
                            windowOpened = false;
                        })
                    });
                windowOpened = true;
            }
            return true;
        });
    } else {
        console.log('web socket is not supported by this browser');
    }
}

function onLocalEventReceived(message, sender, sendResponse) {
    if (message.request == 'open_port') {
        openSerialPort(message.payload.path, message.payload.options);
    } else if (message.request == 'close_port') {
        closeSerialPort();
    }
}

function sendResponse(response, payload) {
    chrome.runtime.sendMessage({ response : response, payload : payload });
}

function openSerialPort(path, options) {
    if (connectionId != -1 || serialPortOpened) {
        chrome.serial.disconnect(connectionId, openSerialPort);
        return;
    }

    serialPath = path;
    chrome.serial.connect(path, options, onSerialPortOpened);
}

function closeSerialPort() {
    chrome.serial.disconnect(connectionId, onSerialPortClosed);
}

function sendToSerialPort(buffer) {
    if (-1 != connectionId) {
        chrome.serial.send(connectionId, buffer, function(sendInfo) {

        });
    } else {
        console.log('serial port is closed');
    }
}

function onSerialPortOpened(connectionInfo) {
    connectionId = connectionInfo.connectionId;
    if (connectionId == -1) {
        sendResponse('port_open_failed', connectionInfo);
        return;
    }
    sendResponse('port_opened', connectionInfo);
    serialPortOpened = true;
}

function onSerialPortClosed() {
    connectionId = -1;
    serialPortOpened = false;
    sendResponse('port_closed');
}

function onSerialPortReceived(readInfo) {
    if (-1 != readInfo.connectionId && readInfo.connectionId == connectionId) {
        sendDataToSocket(readInfo.data);
    } else {
        console.log('receive error : ' + readInfo.connectionId);
    }
}

function sendDataToSocket(data) {
    socket.send(data);
}


function onSocketData(data) {
    if (data.constructor === ArrayBuffer) {
        sendToSerialPort(data);
    } else if ('string' == typeof data) {
        sendToSerialPort(str2ab(data));
    } else {
        alert('type error : ' + typeof data);
    }
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
