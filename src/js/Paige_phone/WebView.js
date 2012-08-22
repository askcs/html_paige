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

/* register the plugin */
if (!window.plugins)
	window.plugins = {};
if (!window.plugins.webView)
	window.plugins.webView = new WebViewPG();
