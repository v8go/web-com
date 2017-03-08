# Web COM
Version 0.0.2

This Chrome app provides serial port access ability for your website.

## Installation

Method 1: Go to Chrome's Tools -> Extensions then click "Load unpacked extension...". Then click on Launch to get it working

Method 2: Or, You can install it by dragging and dropping the released crx file in the root directory to chrome://extensions/

Method 3: Visit here for official installation: https://chrome.google.com/webstore/detail/web-com/mbndnomfbkfijpkbmnohmnnbfbhknfba

## How to use

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
3. Select path and connection options, open the serial port, and then use ```ws.send()``` to send string or array buffer
![alt tag](https://github.com/strawmanbobi/web-com/blob/master/src/example/screen_cap.png)

You can also find the example here:
https://jsfiddle.net/strawmanbobi/nt4x3c23/
