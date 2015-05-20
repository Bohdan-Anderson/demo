var app = {
	idListen: {
		init: function() {
			console.log("listen")
			app.socket.on("setId", app.idListen.set)
		},
		set: function(msg) {
			console.log(msg)
			app.cookie.set("myid", msg.cookie, 30);
		}
	},

	cookie: {
		set: function(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		},
		get: function(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			}
			return "";
		}
	},


	data: {
		"type": "alldata",
		orientation: window.orientation,
		x: null,
		y: null,
		z: null
	},
	previous: new Date(),

	init: function() {
		console.log("starting");
		app.socket = io.connect("http://192.168.17.10:8000");
		app.idListen.init();
		window.addEventListener("deviceorientation", app.onOrientaionEvent, true);
		window.addEventListener("orientationchange", app.orientation, false);
		// setInterval(app.beat, 5000);
	},

	beat: function(event) {
		app.socket.emit("data", app.data);
	},

	orientation: function(event) {
		app.data.orientation = window.orientation;
	},

	onOrientaionEvent: function(event) {
		var now = new Date();
		if (now - app.previous < 100) {
			return false;
		}
		app.previous = now;
		app.data.x = parseInt(event.gamma * 100) / 100;
		app.data.y = parseInt(event.alpha * 100) / 100;
		app.data.z = parseInt(event.beta * 100) / 100;

	},

	id: {
		init: function() {
			app.socket.on("setId", app.id.set)
		},
		set: function(msg) {
			app.cookie.set("id", msg.id, 1);
		}
	},

	cookie: {
		set: function(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		},
		get: function(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			}
			return "";
		}
	}

}
app.init();