/**
 * Created by strawmanbobi
 * 2017-02-06
 */

var readBuffer = '';
var background = null;

function $(id) {
    return document.getElementById(id);
}

// message handler
function sendRequest(request, payload) {
    chrome.runtime.sendMessage({ request : request, payload : payload });
}

// serial port operations
function initPortList(ports) {
    var portList = document.getElementById('port_list');
    ports.forEach(function (port) {
        var portOption = document.createElement('option');
        portOption.value = portOption.innerText = port.path;
        portList.appendChild(portOption);
    });

    portList.onchange = function () {

    };
}

function openSerialPort() {
    var portList = document.getElementById('port_list');
    var selectedPort = portList.options[portList.selectedIndex].value;
    var portOptions = {

    };
    sendRequest('open_port', { path : selectedPort });
}

function closeSerialPort() {
    sendRequest('close_port', null);
}

function setStatus(status) {
    document.getElementById('status').innerText = status;
}

// serial port event handlers
function onSerialPortOpened(openInfo) {
    setStatus('Opened');
    $('connect_button').innerHTML = 'Close';
}

function onSerialPortOpenFailed(openInfo) {
    console.log(openInfo);
    setStatus('Open failed');
}

function onSerialPortClosed() {
    setStatus('Closed');
    $('connect_button').innerHTML = 'Open';
}

function onSerialReceived(readInfo) {
    console.log(readInfo.connectionId);
}

// local event handlers
function onLoad() {
    chrome.runtime.getBackgroundPage(function (backgroundPage) {
        background = backgroundPage;
    });
    
    chrome.runtime.onMessage.addListener(
        function(message, sender, sendResponse) {
            if (message.response == 'port_opened') {
                onSerialPortOpened(message.payload);
            }
            else if (message.response == 'port_open_failed') {
                onSerialPortOpenFailed(message.payload);
            }
            else if (message.response == 'port_closed') {
                onSerialPortClosed();
            }
        });

    // scan for serial ports
    chrome.serial.getDevices(function (devices) {
        initPortList(devices);
    });

    $('connect_button').addEventListener('click', function() {
        if (-1 == background.connectionId) {
            openSerialPort();
        } else {
            closeSerialPort();
        }
    });
}

function onRuntimeMessage(message, sender, sendResponse) {
    console.log('onRuntimeMessage : ' + message);
}


function onSocketReceived(data) {
    console.log('data received from socket ： ' + data);
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
