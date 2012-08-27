function SystemNotification() {
}

SystemNotification.prototype.notificationEnabled = false;

SystemNotification.prototype.newCount = 0; //to keep track of multiple notifications events

SystemNotification.prototype.enableNotification = function () {
    this.notificationEnabled = true;
};

SystemNotification.prototype.disableNotification = function () {
    this.notificationEnabled = false;
};

SystemNotification.prototype.onBackground = function () {
    this.enableNotification();
};

SystemNotification.prototype.onForeground = function () {
    this.disableNotification();
};

SystemNotification.prototype.createStatusBarNotification = function (contentTitle, contentText, tickerText) {
    cordova.exec(null, null, "SystemNotification", "createStatusBarNotification", [contentTitle, contentText, tickerText]);
};

SystemNotification.prototype.updateNotification = function (contentTitle, contentText, tickerText) {
    this.newCount++;
    if (this.newCount === 1) {
        this.createStatusBarNotification(contentTitle, contentText, tickerText);
    } else {
        cordova.exec(null, null, "SystemNotification", "updateNotification", [contentTitle, contentText, tickerText]);        
	//this.showTickerText(tickerText);  //optional
    }
};

SystemNotification.prototype.cancelNotification = function (contentTitle, contentText, tickerText) {
    this.newCount--;
    if (this.newCount === 0) {
        cordova.exec(null, null, "SystemNotification", "cancelNotification", []);
    }
    else {
	//updating the notification
        cordova.exec(null, null, "SystemNotification", "updateNotification", [contentTitle, contentText, tickerText]);
    }
};

SystemNotification.prototype.showTickerText = function (tickerText) {
    cordova.exec(null, null, "SystemNotification", "showTickerText", [tickerText]);
};

SystemNotification.prototype.touch = function () {
    cordova.exec(null, null, "SystemNotification", "touch", []);
};

SystemNotification.prototype.beep = function (count) {
    cordova.exec(null, null, "SystemNotification", "beep", [count]);
};

/* register the plugin */
if (!window.plugins)
	window.plugins = {};
if (!window.plugins.PaigeSystemNotification)
	window.plugins.PaigeSystemNotification = new SystemNotification();
