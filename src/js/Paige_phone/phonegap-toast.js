var Toasti = function() {
};

Toasti.prototype.show_long = function(message, win, fail) {
  cordova.exec(win, fail, "Toasti", "show_long", [message]);
};

Toasti.prototype.show_short = function(message, win, fail) {
  cordova.exec(win, fail, "Toasti", "show_short", [message]);
};

/**
 * <ul>
 * <li>Register the ToastPlugin Javascript plugin.</li>
 * <li>Also register native call which will be called when this plugin runs</li>
 * </ul>
 */
cordova.addConstructor(function() { 
  // Register the javascript plugin with cordova
  console.log("registering Toasti()");
  cordova.addPlugin('Toasti', new Toasti());

  // Register the native class of plugin with cordova
  //navigator.app.addService("Toasti", "nl.ask.paige.plugin.Toasti"); 
});