/**
 * Created by strawmanbobi
 * 2017-02-06
 */

var readBuffer = "";
var background = null;

function $(id) {
    return document.getElementById(id);
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

    // send message to background task to open serial port
    background.openSerialPort(selectedPort);
}

function closeSerialPort() {
    background.closeSerialPort();
}

function setStatus(status) {
    document.getElementById('status').innerText = status;
}

// serial port event handlers
function onSerialPortOpened(openInfo) {
    setStatus('Opened');
    $("connect_button").innerHTML = "Close";
}

function onSerialPortClosed() {
    setStatus('Closed');
    $("connect_button").innerHTML = "Open";
}

function onSerialReceived(readInfo) {
    console.log(readInfo.connectionId);
}

// local event handlers
function onLoad() {
    chrome.runtime.getBackgroundPage(function (backgroundPage) {
        background = backgroundPage;
    });

    // scan for serial ports
    chrome.serial.getDevices(function (devices) {
        initPortList(devices);
    });

    $("connect_button").addEventListener("click", function() {
        if (-1 == background.connectionId) {
            openSerialPort();
        } else {
            closeSerialPort();
        }
    });
}

function onRuntimeMessage(message, sender, sendResponse) {
    console.log("onRuntimeMessage : " + message);
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
