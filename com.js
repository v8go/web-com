/**
 * Created by strawmanbobi
 * 2017-02-03
 */

chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        bounds: {
            top: 0,
            left: 0,
            width: 640,
            height: 720
        }
    });
});
