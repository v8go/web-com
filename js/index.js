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

var background = null;

function $(id) {
    return document.getElementById(id);
}

function sendMessage(request, payload) {
    chrome.runtime.sendMessage({ request : request, payload : payload });
}

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

function openSerialPort(connectionOptions) {
    var portList = document.getElementById('port_list');
    var selectedPort = portList.options[portList.selectedIndex].value;
    sendMessage('open_port', { path : selectedPort, options : connectionOptions });
}

function closeSerialPort() {
    sendMessage('close_port', null);
}

function setStatus(status) {
    document.getElementById('status').innerText = status;
}

function onSerialPortOpened(openInfo) {
    setStatus('Opened');
    $('button_connect').innerHTML = 'Close';
}

function onSerialPortOpenFailed(openInfo) {
    console.log(openInfo);
    setStatus('Open failed');
}

function onSerialPortClosed() {
    setStatus('Closed');
    $('button_connect').innerHTML = 'Open';
}

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

    chrome.serial.getDevices(function (devices) {
        initPortList(devices);
    });

    $('button_connect').addEventListener('click', function() {
        var connectionOptions = {
            persistent : 'true' == $('persist').value,
            bitrate : parseInt($('baud_rate').value),
            dataBits :  $('databits').value,
            parityBit :  $('parity').value,
            stopBits :  $('stopbits').value,
            ctsFlowControl :  'true' == $('flow_control').value
        };
        if (-1 == background.connectionId) {
            openSerialPort(connectionOptions);
        } else {
            closeSerialPort();
        }
    });
}
