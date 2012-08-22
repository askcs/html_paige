var Toasti = function() {
};

Toasti.prototype.show_long = function(message, win, fail) {
  cordova.exec(win, fail, "Toasti", "show_long", [message]);
};

Toasti.prototype.show_short = function(message, win, fail) {
  cordova.exec(win, fail, "Toasti", "show_short", [message]);
};

/* register the plugin */
if (!window.plugins)
	window.plugins = {};
if (!window.plugins.Toasti)
	window.plugins.Toasti = new Toasti();
