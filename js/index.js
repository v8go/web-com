/**
 * Created by strawmanbobi
 * 2017-02-03
 */

var connectionId = -1;
var readBuffer = "";

onload = function () {
    chrome.serial.getPorts(function (ports) {
        initPortList(ports);
    });
};


function onOpen(openInfo) {
    connectionId = openInfo.connectionId;
    console.log("connectionId: " + connectionId);
    if (connectionId == -1) {
        setStatus('Could not open');
        return;
    }
    setStatus('Connected');

    setPosition(0);
    chrome.serial.read(connectionId, 1, onRead);
};

function setStatus(status) {
    document.getElementById('status').innerText = status;
}

function initPortList(ports) {
    /*
    var availablePorts = ports.filter(function (port) {
        return !port.match(/[Bb]luetooth/) &&
            (port.match(/\/dev\/tty/) || port.match(/\/dev\/tty/));
    });
    */
    var availablePorts = ports;

    var portList = document.getElementById('port_list');
    availablePorts.forEach(function (port) {
        var portOption = document.createElement('option');
        portOption.value = portOption.innerText = port;
        portList.appendChild(portOption);
    });

    portList.onchange = function () {
        /*
        if (connectionId != -1) {
            chrome.serial.close(connectionId, openSelectedPort);
            return;
        }
        openSelectedPort();
        */
    };
}

function openSelectedPort() {
    var portPicker = document.getElementById('port-picker');
    var selectedPort = portPicker.options[portPicker.selectedIndex].value;
    chrome.serial.open(selectedPort, onOpen);
}

function sendData(buffer) {
    chrome.serial.write(connectionId, buffer, function () {
        ;
    });
};

function onReceived(readInfo) {
    var uint8View = new Uint8Array(readInfo.data);
    // Keep on reading.
    chrome.serial.read(connectionId, 1, onReceived);
};
