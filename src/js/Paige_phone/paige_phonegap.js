document.addEventListener('deviceready', function() {
	setTimeout( function() {
		console.log("phoneGapAvailable to True!");
		phoneGapAvailable = true;
		
		// hide the splash screen
		navigator.splashscreen.hide();
		
		// initialize the Sense plugin
		window.plugins.sense.init();
		
		if(session.isLogin()){
		    console.log("c2dmKey:"+localStorage['C2DMKey']);
		    if(localStorage['C2DMKey'] != null && typeof localStorage['C2DMKey'] != "undefined"){
	            setTimeout(function() { 
	                dataCon.post("timeout/setC2DM",{"key":localStorage['C2DMKey']},function(){
	                    console.log("C2DM send!");
	                });
	            }, 1000);                    
	        }else{
	            console.log("C2DM Key init wrong! ");
	            if(phoneGapAvailable){
	                window.plugins.pee.registerC2DM();
	            }
	        }  
		}
        
		session.addCallback("logoff", function() {
			localStorage.removeItem("sesID");
			console.log(localStorage.getItem("sesID"));
			console.log("callback: Logoff");
			try {
				window.plugins.sense.toggleMain(false, function() {
					console.log("Logoff: Stopped Sense");
				}, function() {
					console.log("Logoff: Failed to stop Sense");
				});
				//go back to login paige in native app TODO
				
			} catch (e) {
				console.log('Logoff: Sense logoff failed');
			}
			
		});
	
		// ecare
		session.addCallback("login", function() {
			var username = $('#Ecare_loginuuid').val();
			var passwd = $('#Ecare_loginpass').val();
			if (username && passwd) {
				window.plugins.sense.changeLogin(username, passwd, function() {
					console.log("Ecare: Successfully logged into Sense");
				}, function() {
					console.log("Paige can't access your sensors, some functions might not be working");
				});
				window.plugins.sense.toggleMain(true);
				window.plugins.sense.togglePhoneState(true);
				window.plugins.sense.togglePosition(true);
				window.plugins.sense.toggleMotion(true);
				window.plugins.sense.toggleAmbience(true);
				window.plugins.sense.toggleNeighDev(true);
			}
		});
	
		// $(document).live("backbutton", onBackButtonDown);
		document.addEventListener("backbutton", onBackButtonDown, false);
	}, 1000);
	
}, false);

function takePicture() {
	console.log("capture api!");
	navigator.device.capture.captureImage(function(res) {
		console.log("success:", res)
	}, function(res) {
		console.log("failure:", res)
	}, {
		sourceType : Camera.PictureSourceType.CAMERA
	});
}

// TODO: make this a callback based structure:
function receiverTrigger(json) {
	console.log("Received trigger: " + json);
	json = JSON.parse(json);
	if (json.sensorName == "epi state") {
		window.plugins.webView.sendAppToFront();
		paige.say("Automatically triggering the alarm!", Paige.PRIO_VIBRBEEP);
		alarmSM.setState("alarm");
		// sendMessage("lstellingwerff@ask-cs.com","Alarm",1,"Alarm knop
		// ingedrukt!");
		$.mobile.changePage("alarm_running.html");
	}
}

// Just a little sleepfunction for experimental stuff
function sleep(ms) {
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}


/*
 * Start Google Maps through an intent mechanism In this example maps is called
 * by a view and the geo data is given by a url. For starting the Sense app no
 * url is needed only the action nl.sense_os.app.SenseApp For sending data via
 * the Sense app see senteToSenseApp function
 */
function showMap(address) {
	window.plugins.intentjs.startActivity({
		action : IntentJS.ACTION_VIEW,
		url : 'geo:0,0?q=' + address
	}, function() {
	}, function() {
		alert('Failed to open URL via Android Intent');
	});
};

// Start email editor with subject and body already filled in
function sendEmail(subject, body) {
	var extras = {};
	extras[IntentJS.EXTRA_SUBJECT] = subject;
	extras[IntentJS.EXTRA_TEXT] = body;

	window.plugins.intentjs.startActivity({
		type : 'text/plain',
		extras : extras
	}, function() {
	}, function() {
		alert('Failed to send email via Android Intent');
	});
};

if (typeof window.plugins.systemNotification == "undefined") {
	window.plugins.systemNotification = {
		enableNotification : function() {
		},
		createStatusBarNotification : function() {
		},
		updateNotification : function() {
		}
	}
}

// Show notification in status bar
function showNoti() {
	window.plugins.systemNotification.enableNotification();
	window.plugins.systemNotification.createStatusBarNotification('row 1',
			'row 2', 'statusbar text');
};

// Update the notification in the status bar
function uptNoti() {
	window.plugins.systemNotification.updateNotification('row 1 updated',
			'row 2 updated', 'statusbar text updated');
};

// Start an bring another application to front. For example the Sense
// application. For simple starting an app startApp is enough. For starting an
// app with data like geo data see the function showMap()
function startApp(app) {
	window.plugins.intentjs.startActivity({
		action : app
	}, function() {
	}, function() {
		alert('Failed to open app via Android Intent');
	});
};

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
function onDeviceReady() {
	// document.addEventListener("menubutton", onMenuKeyDown, false);
	// count here for every time the app is launched, so that we can keep track
	// of whether to show tour or not.
	// LoginToSense('paige', 'paige');
	// LoginToSense('paige', 'paige');
}

// Handle the menu button
function onMenuKeyDown() {
	console.log('You pressed the menubutton');
	// startApp('nl.sense_os.app.SenseApp');
}

// Handle the back button
function onBackButtonDown() {
	var close, back;
	close = $('#paigedialogClose');
	back = $('#backButton:visible');
	if (close.length) {
		close.trigger('click');
	} else if (back.length) {
		eval(back.attr("href"));
	} else {
		navigator.app.exitApp();
	}
}

// Refresh the webpage
function refresh() {
	window.location.reload(false);
};

/*
 * Show toast like: SHort is a quick message and disappears after 3,5 seconds
 * ___________________________ ( The sense app is running )
 * ---------------------------
 */
function Toast_long(text) {
	window.plugins.Toasti.show_long(text);
};

/*
 * Show toast like: Short is a quick message and disappears after 2 seconds
 * ___________________________ ( The sense app is running )
 * ---------------------------
 */
function Toast_short(text) {
	window.plugins.Toasti.show_short(text);
};

if (typeof window.plugins.notification == "undefined") {
	window.plugins.notification = {
		beep : function() {
		},
		vibrate : function() {
		},
		alert : function() {
		}
	}
}

// Beep x = amount of beeps
var beep = function(x) {
	window.plugins.notification.beep(x);
};

// vibrate
var vibrate = function() {
	window.plugins.notification.vibrate(0);
};

// show alert, possible to edit text and title
// The notification.alert function says you can edit the button text but OK
// don't changes if there is typed another text as second param
var showalert = function(text, title) {
	window.plugins.notification.alert(text, // text
	'O', // button
	title // title
	);
}

function setUrl(url) {
	window.plugins.WebView.setUrl(url);
}

function sendAppToFr() {
	window.plugins.webView.sendAppToFront();
}

