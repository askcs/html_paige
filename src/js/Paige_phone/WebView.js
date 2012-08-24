function WebViewPG() {

}

WebViewPG.prototype.setUrl = function(url) {
    	cordova.exec(null, null, "WebViewPG", "setUrl", [url]);
};

WebViewPG.prototype.sendAppToFront = function() {
    	cordova.exec(null, null, "WebViewPG", "sendAppToFront", []);
};

WebViewPG.prototype.touch = function () {
    	cordova.exec(null, null, "WebViewPG", "touch", []);
};

cordova.addConstructor(function () {
    if (typeof(window.plugins.webView) == "undefined") {
    	console.log('registering webViewPG()');
    	cordova.addPlugin('webView', new WebViewPG());
    }
});
