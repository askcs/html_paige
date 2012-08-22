var IntentJS = function() { 

};

IntentJS.ACTION_SEND = "android.intent.action.SEND";
IntentJS.ACTION_VIEW = "android.intent.action.VIEW";
IntentJS.EXTRA_TEXT = "android.intent.extra.TEXT";
IntentJS.EXTRA_SUBJECT = "android.intent.extra.SUBJECT";

IntentJS.ACTION_SENSE = "nl.sense-os.app"

IntentJS.prototype.startActivity = function(params, success, fail) {
	return cordova.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'IntentJS', 'startActivity', [params]);
};

IntentJS.prototype.hasExtra = function(params, success, fail) {
	return cordova.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'IntentJS', 'hasExtra', [params]);
};

IntentJS.prototype.getExtra = function(params, success, fail) {
	return cordova.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'Intent', 'getExtra', [params]);
};

IntentJS.prototype.getDataString = function(success, fail) {
	return cordova.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'IntentJS', 'getDataString', []);
};

IntentJS.prototype.logOff = function(success, fail){
	console.log("JS: logOff");
	return cordova.exec(function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'IntentJS', 'logOff', []);
};

/* register the plugin */
if (!window.plugins)
	window.plugins = {};
if (!window.plugins.intentjs) 
	window.plugins.intentjs = new IntentJS();
