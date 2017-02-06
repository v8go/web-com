/**
 * Created by strawmanbobi
 * 2017-02-06
 */

var connectionId = -1;
var readBuffer = "";

function $(id) {
    return document.getElementById(id);
}

function log(text) {
    console.log(text + '\r');
}

onload = function () {
    chrome.runtime.onMessage.addListener(onRuntimeMessage);
};

function onOpen(openInfo) {
    connectionId = openInfo.connectionId;
    console.log("connectionId: " + connectionId);
    if (connectionId == -1) {
        setStatus('Could not open');
        return;
    }
    setStatus('Connected');
}

function setStatus(status) {
    document.getElementById('status').innerText = status;
}

function initPortList(ports) {
    var availablePorts = ports;
    var portList = document.getElementById('port_list');
    availablePorts.forEach(function (port) {
        var portOption = document.createElement('option');
        portOption.value = portOption.innerText = port.path;
        portList.appendChild(portOption);
    });

    portList.onchange = function () {
        if (connectionId != -1) {
            chrome.serial.disconnect(connectionId, openSelectedPort);
            return;
        }
        openSelectedPort();
    };
}

function openSelectedPort() {
    var portList = document.getElementById('port_list');
    var selectedPort = portList.options[portList.selectedIndex].value;
    chrome.serial.connect(selectedPort, null, onOpen);
}

function sendData(str) {
    chrome.serial.send(connectionId, convertStringToArrayBuffer(str), function () {
    });
}

function onSerialReceived(readInfo) {
    console.log(readInfo.connectionId);
}

function onRuntimeMessage(message, sender, sendResponse) {
    console.log("onRuntimeMessage : " + message);
    if(message.method == 'socket_connected') {
        onSocketConnected();
    }
}

function onSocketConnected() {
    // scan for serial ports
    chrome.serial.getDevices(function (devices) {
        initPortList(devices);
        openSelectedPort();
    });

    // register serial port data receive callback
    chrome.serial.onReceive.addListener(onSerialReceived);
}

function onSocketReceived(data) {
    console.log("data received from socket ： " + data);
}

// utils
function convertStringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}