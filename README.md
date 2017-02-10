# Web COM

This Chrome app provides serial port access ability for your website.

## Installation

Go to Chrome's Tools -> Extensions then click "Load unpacked extension...". Then click on Launch to get it working.

## How to use

There an example showing how to use this chrome packaged app in your website.

1. Install and start Web COM packaged app, it will listen on port 8301 (or you could change the listen port)

2. Create a websocket connecting to localhost:8301 with type 'arraybuffer' and add your event callback handlers
```javascript
ws = new WebSocket('ws://localhost:8301/');
ws.binaryType = 'arraybuffer';

ws.addEventListener('open', function() {
    ...
});
ws.addEventListener('close', function() {
    ...
});
ws.addEventListener('message', function(data){
    ...
});
```
