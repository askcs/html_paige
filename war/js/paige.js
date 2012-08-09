/*
 * Paige core: session management, Paige chat, Modules/settings, tools
 *
 */
//Set the global session variables:
var session = new aSession();
// var paige = new Paige();
var phoneGapAvailable = false;
// var paigeSettings = new Settings();
var dataCon = new PaigeData();
// var paigeUser = new PaigeUser();
// var paigeProfiles = new PaigeProfiles();

// var remindMe = true;
// var FillProfile;
// var ShowSocial;
// var visitFlag = 0;
// var socialFlag=0;
// 
// var d = new Date();
// var dat = d.getDate();
// var mon = d.getMonth() + 1;
// var year = d.getFullYear();
// var todayDate = dat + "/" + mon + "/" + year;

/*
 * Paige class, providing emotions, personality and conversation
 * 
 * For full features, depends on PhoneGap. (Set phoneGapAvailable to true in
 * onDeviceReady callback!)
 * 
 * API: paige.dialogBox = Jquery object paige.init(); paige.say(text,prio);
 * TODO: paige.ask(question,array of answerobjs,prio); TODO: paige should have
 * an emotions statemachine
 */

/*
 * Simple non-offline data collection
 */
function PaigeData() {

}

PaigeData.prototype.get = function(restPath, data, callback) {
	if (!session.isSession()) {
		console.log("Direct data: Info: No session available, not retrying");
		session.authenticator();
		return;
	}
	var oldKey = session.sessionKey;
	var dataCon = this;
	function forbidden() {
		if (session.sessionKey != oldKey && session.isSession()) {
			console.log("Direct data: Info: New session available, retrying");
			dataCon.get(restPath, data, callback);
		} else {
			console
					.log("Direct data: Info: Need to login at server, not retrying!");
			session.authenticator();
		}
	}

	$.Read(session.appServices + restPath, data, {
		url : session.appServices + restPath,
		headers : {
			'X-SESSION_ID' : session.sessionKey
		},
		xhrFields : {
			withCredentials : true
		},
		cache : false,
		200 : function cb(res) {
			callback(res.responseText);
		},
		403 : function callback(res) {
			forbidden();
		}
	});
}

PaigeData.prototype.post = function(restPath, data, callback) {
	if (!session.isSession()) {
		console.log("Direct data: Info: No session available, not retrying");
		session.authenticator();
		return;
	}
	var oldKey = session.sessionKey;
	var dataCon = this;
	function forbidden() {
		if (session.sessionKey != oldKey && session.isSession()) {
			console.log("Direct data: Info: New session available, retrying");
			dataCon.get(restPath, data, callback);
		} else {
			console
					.log("Direct data: Info: Need to login at server, not retrying!");
			session.authenticator();
		}
	}

	$.Create(session.appServices + restPath, data, {
		url : session.appServices + restPath,
		headers : {
			'X-SESSION_ID' : session.sessionKey
		},
		xhrFields : {
			withCredentials : true
		},
		cache : false,
		200 : function cb(res) {
			if (callback)
				callback(res.responseText);
		},
		403 : function callback(res) {
			forbidden();
		}
	});
}

PaigeData.prototype.put = function(restPath, data, callback) {
	if (!session.isSession()) {
		console.log("Direct data: Info: No session available, not retrying");
		session.authenticator();
		return;
	}
	var oldKey = session.sessionKey;
	var dataCon = this;
	function forbidden() {
		if (session.sessionKey != oldKey && session.isSession()) {
			console.log("Direct data: Info: New session available, retrying");
			dataCon.get(restPath, data, callback);
		} else {
			console
					.log("Direct data: Info: Need to login at server, not retrying!");
			session.authenticator();
		}
	}

	$.Update(session.appServices + restPath, data, {
		url : session.appServices + restPath,
		headers : {
			'X-SESSION_ID' : session.sessionKey
		},
		xhrFields : {
			withCredentials : true
		},
		cache : false,
		200 : function cb(res) {			
			if (callback)
				callback(res.responseText);
		},
		403 : function callback(res) {
			forbidden();
		}
	});
}

PaigeData.prototype.DELETE = function(restPath, data, callback) {
	if (!session.isSession()) {
		console.log("Direct data: Info: No session available, not retrying");
		session.authenticator();
		return;
	}
	var oldKey = session.sessionKey;
	var dataCon = this;
	function forbidden() {
		if (session.sessionKey != oldKey && session.isSession()) {
			console.log("Direct data: Info: New session available, retrying");
			dataCon.get(restPath, data, callback);
		} else {
			console
					.log("Direct data: Info: Need to login at server, not retrying!");
			session.authenticator();
		}
	}

	$.Delete(session.appServices + restPath, data, {
		url : session.appServices + restPath,
		headers : {
			'X-SESSION_ID' : session.sessionKey
		},
		xhrFields : {
			withCredentials : true
		},
		cache : false,
		200 : function cb(res) {			
			if (callback)
				callback(res.responseText);
		},
		403 : function callback(res) {
			forbidden();
		}
		
		
	});
}


/*
 * Session class, providing login management.
 * 
 * usefull API: session.authenticator() session.isSession()
 * session.addCallback(when, callback) session.logoff()
 * handle_session(sessionKey);
 * 
 */
function aSession(sKey) {
	this.sessionKey = localStorage["paigeSessionKey"];
	this.appServices = localStorage["paigeAppServices"];
	this.uuid = localStorage["paigeUser"];
	if (!this.appServices) {
		this.appServices = "http://localhost:8888/";
	}
	if (sKey) {
		this.setSessionKey(sKey);
	}
	this.loading = false;
	this.onAuthenticator = [];
	this.onLogin = [];
	this.onLogoff = [];
}

aSession.prototype.isSession = function() {
	return (this.sessionKey != null && this.sessionKey != "");
}

aSession.prototype.setSessionKey = function(sKey) {
	this.sessionKey = sKey;
	localStorage.setItem("paigeSessionKey", sKey);
}

aSession.prototype.addCallback = function(when, callback) {
	switch (when) {
	case "authenticator":
		this.onAuthenticator = this.onAuthenticator.concat([ callback ]);
		break;
	case "login":
		this.onLogin = this.onLogin.concat([ callback ]);
		break;
	case "logoff":
		this.onLogoff = this.onLogoff.concat([ callback ]);
		break;
	default:
		console.log("Unknown session callback registered");
	}
}

aSession.prototype.authenticator = function() {
	// TODO: find a way to determine login pages in a more generic way
	function isLoginPage(page) {
	
		var i = page.indexOf('?');
		if (i >= 0) {
			page = page.substr(0, i);
		}
		switch (page) {

			case "/paige.html":
			case "/login.html":
			case "/register.html":
			case "/forgotpass.html":
			case "/login_classic.html":
			case "/login_ret.html":
			case "/ecare/ecare_login.html":
			case "/demo/Tour.html":
			case "/demo/Tour_Msg.html":
			case "/demo/welcome_msg.html":
			case "/account/activate.html":
			case "/demo/reset_pass.html":
			case "/rszk/rszk_login.html":
				return true;

		}
		return false;
	}

	if(phoneGapAvailable && window.plugins.pee) {
		//Alternative login???
		window.plugins.pee.renewSession(function(result){
			//alert("Received session: "+result);
			handle_session(result);
		},function(error) {
			console.log("Ahhhhh is going wrong!!!, in pee renewSession.");
		});
		return false;
	} else {
		var session = this;
		if (session.loading) {
			console.log("login page locked!");
			return false;
		}
		if (!isLoginPage(currentPage())) {
			console.log("locking login page!");
			
			session.loading = true;
			session.onAuthenticator.map(function(func) {
				func();
			});
			session.setSessionKey("");
			loginPage = "/login.html";
			if (typeof paigeSettings.conf.loginPage != "undefined") {
				loginPage = paigeSettings.conf.loginPage;
			}
			changePage(loginPage, null, {
				changeHash : false,
				role : "dialog",
				reloadPage : true
			});
		}
	}

}
aSession.prototype.logoff = function() {
	session.onLogoff.map(function(func) {
		func();
	});

	$.xhrPool.abortAll();

	// Do serverside logout:
	$.ajax(this.appServices + "logout/", {
		headers : {
			'X-SESSION_ID' : this.sessionKey
		},
		xhrFields : {
			withCredentials : true
		}
	});
	// local cleanup:
	document.cookies = "";
	// TODO Doesn't work, cookie is on other domain!
	this.setSessionKey("");
	session.loading = false;
	// make this explicit to fix race conditions

	if (localStorage['forget']) {
		localStorage.clear();
	}
	localStorage.removeItem('autologin');

	if (phoneGapAvailable && window.plugins.sense) {
		window.plugins.sense.toggleMain(false, function() {
		}, function() {
		});
		
		window.plugins.intentjs.logOff();
	}

	if (phoneGapAvailable && window.plugins.pee) {
		
		window.plugins.pee.unregisterC2DM();
		window.plugins.pee.logout();
	}
	
	// restart with entirely:
	window.location = "http://" + window.location.host + "/paige.html";

	// return checkbox_value;
}
function handle_session(sessionKey, url) {// Has to be global function
	session.setSessionKey(sessionKey);
	session.uuid = localStorage['paigeUser'];
	session.onLogin.map(function(func) {
		func();
	});
	if (url) {
		changePage(url);
	} else {
		goHome();
	}
}

function receiveC2DM(type, data) {

	console.log("type:" + type);
	console.log("data:" + data);
	// alert("Received type: "+type+" data: "+data);
	if (type == "registered") {
		// store data as device registration ID
		// alert("Registered on: "+data);
		paigeUser.setData("C2DMKey", data);
		var cache = caches.getList("getPaigeQuestions")[0];
		cache.setInterval(900000); // Since we have C2DM set dialog to low
									// interval (15 min)

	} else if (type == "message") {
		// Use data to determine which Cache needs to sync right now.
		if(data == "getQuestion"){
			var cache = caches.getList("getPaigeQuestions")[0];
			cache.sync();
		}
	}
}



/*
 * Paige settings utilities, TODO: provide some sort of offline storage for
 * settings.
 * 
 * 
 * 
 */

function Settings() {
	this.moduleRegister = {};
	this.conf = null;
}

Settings.prototype.setConf = function(profile) {
	var sp;
	this.conf = profile;
}

Settings.prototype.registerModule = function(module) {
	if (this.moduleRegister[module.label])
		console.log("Warning, module already exists, overwriting!");
	this.moduleRegister[module.label] = module;
}

Settings.prototype.getModule = function(module) {
	return this.moduleRegister[module];
}


// session.addCallback("login", setSocialFlag);
//session.addCallback("onDeviceReady", setSocialFlag);//when the device is ready check for flags.
/*
 * Module system, please register you modules in modules.js.
 * 
 * usefull API: PaigeModule.register() PaigeModule.open() //Open startpage of
 * module. PaigeModule.load() //preload pages into JQM
 * 
 * TODO: make changes to these items persistent in localStorage.
 * 
 */
function PaigeModule(label, options) {
	this.label = label;
	this.url = options['url'];
	this.icon = options['icon'];
	this.depends = options['depends'] ? options['depends'] : [];
	this.help = options['help'] ? options['help'] : {};
	this.settings = options['settings'] ? options['settings'] : {};
	this.preload = options['preload'] ? options['preload'] : [];
	this.doPreload = true;
	this.loaded = false;
	this.showOnHomePage = options['showOnHomePage'] ? options['showOnHomePage']
			: false;
}

PaigeModule.prototype.register = function() {
	paigeSettings.registerModule(this);
}
PaigeModule.prototype.open = function() {
	$.mobile.changePage(this.url);
}
PaigeModule.prototype.loadPage = function(page) {
	var module = this;
	if ('#' + page != window.location.hash) {// page will be loaded through
		// paige.html
		var homePage = paigeSettings.getModule(paigeSettings.conf.modules[0]).url;
		if (page != homePage || window.location.hash != "") {// page will be
			// loaded
			// through
			// paige.html
			$.mobile.loadPage(page, {
				showLoadMsg : false
			});
		}
	}
	session.addCallback("logoff", function() {
		$("div:jqmData(url='" + page + "')").removeWithDependents();
	});
}
PaigeModule.prototype.load = function() {
	var module = this;
	if (this.loaded)
		return;
	if (typeof $.mobile == "undefined") {
		console.log("mobile not initialized, failed to preload modules");
		return;
	}
	this.loaded = true;
	this.depends.map(function(module) {
		paigeSettings.getModule(module).load();
	});
	this.preload.map(function(url) {
		module.loadPage(url);
	});
}

/*
 * Statemachine engine, featuring callbacks on state changes
 * 
 * Usefull API: getState() setState() Register callback functions for state
 * changes: callback(callback) toState(newstate,callback)
 * fromState(oldstate,callback)
 */

function StateMachine(initState, label, persistent) {
	this.currentState = initState;
	this.label = label;
	this.persistent = false;
	if (typeof persistent == "boolean") {
		this.persistent = persistent;
	}
	if (this.persistent) {
		if (typeof localStorage[this.label] != "undefined") {
			this.currentState = localStorage[this.label];
		}
		;
		localStorage[this.label] = this.currentState;
	}
	this.callbacks = null;
	// generic callbacks on all state changes
	this.toStates = {};
	// specific callbacks per newstate
	this.fromStates = {};
	// specific callbacks per oldstate
}

StateMachine.prototype.getState = function() {
	return this.currentState;
}
StateMachine.prototype.setState = function(newstate) {
	var oldstate = this.currentState;
	if (oldstate == newstate)
		return false;

	this.currentState = newstate;
	if (this.persistent) {
		localStorage[this.label] = newstate;
	}
	if (this.fromStates[oldstate] != null) {
		this.fromStates[oldstate].map(function(callback) {
			callback(newstate);
		});
	}
	if (this.callbacks != null) {
		this.callbacks.map(function(callback) {
			callback(oldstate, newstate);
		});
	}
	if (this.toStates[newstate] != null) {
		this.toStates[newstate].map(function(callback) {
			callback(oldstate);
		});
	}

	return true;
}

StateMachine.prototype.callback = function(callback) {
	if (this.callbacks != null) {
		this.callbacks = this.callbacks.concat([ callback ]);
	} else {
		this.callbacks = [ callback ];
	}
}

StateMachine.prototype.toState = function(newstate, callback) {
	if (this.toStates[newstate]) {
		this.toStates[newstate] = this.toStates[newstate].concat([ callback ]);
	} else {
		this.toStates[newstate] = [ callback ];
	}
}

StateMachine.prototype.fromState = function(oldstate, callback) {
	if (this.fromState[oldstate]) {
		this.fromState[oldstate] = this.fromState[oldstate]
				.concat([ callback ]);
	} else {
		this.fromState[oldstate] = [ callback ];
	}
}
/*
 * Utility functions, Array.map, MD5, pad
 */

if (!Array.prototype.map) {
	Array.prototype.map = function(fun /* , thisp */) {
		var len = this.length;
		if (typeof fun != "function")
			throw new TypeError();

		var res = new Array(len);
		var thisp = arguments[1];
		for ( var i = 0; i < len; i++) {
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		}

		return res;
	};
}

function createUUID() {
	var chars = '0123456789abcdef'.split('');

	var uuid = [], rnd = Math.random, r;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	// version 4

	for ( var i = 0; i < 36; i++) {
		if (!uuid[i]) {
			r = 0 | rnd() * 16;

			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
	}

	return uuid.join('');
}

var MD5 = function(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}

	function AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	}

	function F(x, y, z) {
		return (x & y) | ((~x) & z);
	}

	function G(x, y, z) {
		return (x & z) | (y & (~z));
	}

	function H(x, y, z) {
		return (x ^ y ^ z);
	}

	function I(x, y, z) {
		return (y ^ (x | (~z)));
	}

	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}

	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}

	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}

	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string
					.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount]
				| (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	}

	function WordToHex(lValue) {
		var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue
					+ WordToHexValue_temp.substr(
							WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	}

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for ( var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	}

	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
	var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
	var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
	var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
	string = Utf8Encode(string);
	x = ConvertToWordArray(string);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;
	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}
	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
	return temp.toLowerCase();
}
function pad(number, length) {

	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}

	return str;

}

function geo_distance(lat1, lon1, lat2, lon2) {
	return haversine(lat1, lon1, lat2, lon2);
}

function haversine(lat1, lon1, lat2, lon2) {
	var l1 = deg2rad(lat1);
	var l2 = deg2rad(lat2);
	var d1 = Math.sin((l1 - l2) / 2);
	var d2 = Math.sin(deg2rad(lon1 - lon2) / 2);
	var s = Math.sqrt((d1 * d1) + (d2 * d2 * Math.cos(l1) * Math.cos(l2)));
	return 6371000 * 2 * Math.asin(s > 1 ? 1 : s);

}

function deg2rad(deg) {
	return (deg / 180.0) * Math.PI;
}

function getAskatarName(uuid){
	return getCacheModuleName("getPaigeContact",uuid,uuid);
}

function getCacheModuleName(cacheName,uuid,defRet){
	if(caches.exists(cacheName)){
		var paigeCache = null;
		paigeCache = caches.getList(cacheName)[0];
		if(paigeCache == null){
			return defRet;
		}else{
			var cacheOjb = paigeCache.getElement(uuid);
			if(cacheOjb == null){
				return defRet;
			}else{
				return cacheOjb.name;
			}
			
		}
	}else{
		return defRet;
	}
}

function getAskatarModuleName(module,moduleId){
	if(moduleId == null || $.trim(moduleId) == ''){
		return module;
	}
	switch(module){
		case "alarm":
			return getCacheModuleName("getAlarms",moduleId,module);
		break;
		case "group":
			return getCacheModuleName("getPaigeGroup",moduleId,module);
		break;
	}
}
