/**
 * Created by strawmanbobi
 * 2017-02-08
 */

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