/**
 * Created by strawmanbobi
 * 2017-02-03
 */

chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('index.html', {
        bounds: {
            top: 20,
            left: 20,
            width: 320,
            height: 240
        }
    });
});
