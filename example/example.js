/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Copyright 2017 Strawmanbobi
 **/

var ws;

function $(id) {
    return document.getElementById(id);
}

window.onload = function () {
    $('button_start').addEventListener('click', function() {
        startExample();
    });

    $('button_send').addEventListener('click', function() {
        sendData();
    });
};

function startExample() {
    var address = "ws://localhost:8301/";
    ws = new WebSocket(address);
    ws.addEventListener('open', function() {
        console.log('socket connected');
    });
    ws.addEventListener('close', function() {
        console.log('socket connection has been closed');
    });
    ws.addEventListener('message', onDataReceived);
}

function sendData() {
    ws.send($('send_content').value);
}

function onDataReceived(e) {
    console.log(e.data);
}

function toHexString(byteArray) {
    return byteArray.map(function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}