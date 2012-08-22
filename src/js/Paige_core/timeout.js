var session = new paigeSession();
var paigeUser = new PaigeUser();
var phoneGapAvailable = false;

function paigeSession(sKey) {
	this.sessionKey = localStorage["paigeSessionKey"];
	this.appServices = localStorage["appServices"];
	this.uuid = localStorage["PaigeUser"];
	if (!this.appServices) {
		this.appServices = "http://localhost:8888/";
	}
	if (sKey) {
		this.setSessionKey(sKey);
	}
	// this.loading = false;
	// this.onAuthenticator = [];
	this.onLogin = [];
	// this.onLogoff = [];
}

paigeSession.prototype.isLogin = function() {
	// handle_session(localStorage["paigeSessionKey"],"");
	return (typeof this.sessionKey != "undefined" && this.sessionKey != null && this.sessionKey != "");
}

paigeSession.prototype.setSessionKey = function(sKey) {
	this.sessionKey = sKey;
	localStorage.setItem("paigeSessionKey", sKey);
}

paigeSession.prototype.authenticator = function(){
	if(!this.isLogin()){
		// window.location = "login.html";
		this.logoff();
	}
}

paigeSession.prototype.logoff = function(){
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

	localStorage.clear();
	// if (localStorage['forget']) {
		// localStorage.clear();
	// }
	// localStorage.removeItem('autologin');
	
	if (phoneGapAvailable && window.plugins.sense) {
		window.plugins.sense.toggleMain(false, function() {
		}, function() {
		});
		
		if(typeof window.plugins.intentjs != "undefined"){
			window.plugins.intentjs.logOff();
		}
		
	}

	if (phoneGapAvailable && window.plugins.pee) {
		
		window.plugins.pee.unregisterC2DM();
		window.plugins.pee.logout();
	}
	
//	window.location = "login.html";
}

paigeSession.prototype.addCallback = function(when, callback) {
	switch (when) {
	// case "authenticator":
		// this.onAuthenticator = this.onAuthenticator.concat([ callback ]);
		// break;
	case "login":
		this.onLogin = this.onLogin.concat([ callback ]);
		break;
	// case "logoff":
		// this.onLogoff = this.onLogoff.concat([ callback ]);
		// break;
	default:
		console.log("Unknown session callback registered");
	}
}



function handle_session(sessionKey, url) {// Has to be global function
	session.setSessionKey(sessionKey);
	session.uuid = localStorage['paigeUser'];
	if(session.onLogin != null){
		session.onLogin.map(function(func) {
			func();
		});
	}
}

function receiveC2DM(type, data) {

	console.log("type:" + type);
	console.log("data:" + data);
	// alert("Received type: "+type+" data: "+data);
	if (type == "registered") {
		// store data as device registration ID
		
		// alert("Registered on: "+data);
		// paigeUser.setData("C2DMKey", data);
		localStorage.setItem("C2DMKey", data);
		
		
	} else if (type == "message") {
		// Use data to determine which Cache needs to sync right now.
		if(data == "getQuestion"){
			var cache = caches.getList("getTimeout")[0];
			cache.sync();
		}
	}
}

session.addCallback("login",function(){
	if (phoneGapAvailable) {
		console.log("Start to checking msg from Paige app service.");
		function successCallback(result) {
			// handle result
			console.log("Phone Gap Plugin found messages : " + result);
		}
		function failureCallback(error) {
			// handle error
			console.log("Phone Gap Msg Plugin found errors: " + error);
		}

		window.plugins.pee.setCallbackC2DM('receiveC2DM');
		window.plugins.pee.registerC2DM('receiveC2DM');
	}
});



function goHome(){
	window.location = "home.html";
}

// Paige User
function PaigeUser() {
}

PaigeUser.prototype.init = function() {
	var cache = new ASKCache("getPaigeinfo", "resources/", null, "uuid",
			session);
	// this.cache.setInterval(10000);
	cache.addRenderer('all', this.renderInfo);
}

PaigeUser.prototype.renderInfo = function(json, olddata, cache) {

	paigeUser.data = json[0];
	paigeUser.cache = cache;
}

PaigeUser.prototype.setData = function(key, value) {
	if (this.data != null) {
		this.data[key] = value;

		this.cache.addElement(this.data.uuid, this.data);
		this.cache.sync();
	}

	return false
}

PaigeUser.prototype.getData = function(key) {
	var vdata  = this.cache.getElement(this.data.uuid);
	return vdata[key];
}

// Paige Data
var dataCon = new PaigeData();

function PaigeData() {

}

PaigeData.prototype.get = function(restPath, data, callback) {
	if (!session.isLogin()) {
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
			console.log("Direct data: Info: Need to login at server, not retrying!");
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
	if (!session.isLogin()) {
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
			console.log("Direct data: Info: Need to login at server, not retrying!");
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

function alert_timeout(text){
	if($(".alert").length == 0){
		$(".container br").after("<div class=\"alert\"><button class=\"close\" data-dismiss=\"alert\">�</button><strong>Warning!</strong><span></span></div>");
		$(".alert").alert();
	}
	$(".alert span").text(text);
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

var senseProfiles = {
	'timeout': {
		// General
		commonsense_rate:			'0',
		sync_rate:					'1',
		autostart:					true,
		
		// Advanced
		use_commonsense:			true,
		//devmode:					false,
		compression:				true,
		
		// Phonestate
		phonestate_battery:			true,
		phonestate_screen_activity:	true,
		phonestate_proximity:		false,
		phonestate_ip:				false,
		phonestate_data_connection:	false,
		phonestate_unread_msg:		false,
		phonestate_service_state:	false,
		phonestate_signal_strength:	false,
		phonestate_call_state:		true,
		
		// Ambience
		ambience_audio_spectrum:	false,
		ambience_camera_light:		false,
		ambience_light:				false,
		ambience_mic:				true,
		ambience_pressure:			false,
		ambience_temperature:		false,
		
		// Proximity
		proximity_bt:				false,
		proximity_wifi:				false,
		proximity_nfc:				false,
		
		// Location
		location_gps:				false,
		location_network:			true,
		automatic_gps:				false,
			
		// Motion
		motion_fall_detector:		false,
		motion_epimode:				false,
		motion_unregister:			false,
		motion_energy:				true,
		motion_screenoff_fix:		false
	}
};

function buildFooter(active)
{
	//var menuItems = new Array;	
	var menuItems = ['home', 'notes', 'emotion', 'call'];
	var menuLinks = ['timeoutBlock', 'notesBlock', 'emotionBlock', 'call'];
	var menuNames = ['Home', 'Notities', 'Emotie', 'Noodoproep'];
   
	var navbar = $('<div class="footerMenu footerMenuShadow bgWhite"></div>');

	for(var i in menuItems)
	{
		if (menuNames[i] == active)
		{
			var arrow = '<div class="footerMenuArrow"></div>';
		}
		else
		{
			var arrow = '';
		}
		
		if (menuNames[i] == 'Noodoproep')
		{
			var item = $('<div class="menuItem call bgRed"></div>');
			item.append('<a id="callButton">' + arrow + '<div class="menuIcon" id="' + menuItems[i] + '"></div><span class="footerMenuTitle">' + menuNames[i] + '</span></a>');
		}
		else
		{
			var item = $('<div class="menuItem"></div>');
			//item.append('<a href="' + menuItems[i] + '.html">' + arrow + '<div class="menuIcon" id="' + menuItems[i] + '"></div><span class="footerMenuTitle">' + menuNames[i] + '</span></a>');
			item.append('<a onclick="changeDivPage(\'' + menuLinks[i] + '\')">' + arrow + '<div class="menuIcon" id="' + menuItems[i] + '"></div><span class="footerMenuTitle">' + menuNames[i] + '</span></a>');
		}
		
			
//		var menu = menuNames[i].charAt(0).toUpperCase() + menuNames[i].slice(1);

		

		navbar.append(item);
	}
	
	$('#contentContainer').append(navbar); 
}

function buildHeader()
{
	var headerTop = $('<div id="headerTop" class="bgWhite"></div>');
	var headerLogo = $('<div id="headerLogo"></div>');
	
	// TODO the logo image should be done in CSS, not using an <img> tag
	headerLogo.append('<div class="logoIcon"><img src="images/logoIcon.png" height="36" width="36"></div>');
	headerLogo.append('<div class="logoText">Time out!</div>');
	headerTop.append(headerLogo);

	var toggleMenu = $('<div id="toggleMenu" class="notActive"></div>');
	headerTop.append(toggleMenu);
	
	var headerMenu = $('<div id="headerMenu" class="displayNone"></div>');
	
	var menuUl = $('<ul></ul>');
	
	menuUl.append('<li><a href="javascript:location.reload(true)">Home</a></li>');
	menuUl.append('<li><a href="javascript:location.reload(true)">Refresh</a></li>');
	menuUl.append('<li><a href="">Settings</a></li>');
	menuUl.append('<li><a href="">Help</a></li>');
	menuUl.append('<li><a href="javascript:" class="noBorder" id="button_logout">Logout</a></li>');
	
	$(menuUl.find('#button_logout')[0]).live('click',function(){
		session.logoff();
	})
	headerMenu.append(menuUl);
	
	
	$('#header').append(headerTop, headerMenu); 
}
