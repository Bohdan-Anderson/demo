var app = {
	id: {
		init: function() {
			app.socket.on("setId", app.id.set)
		},
		set: function(msg) {
			console.log(msg)
			app.cookie.set("id", msg.cookie, 1);
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

	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		app.id.init();
		$("#button").click(app.clickButton);
	},

	clickButton: function(event) {
		app.socket.emit("data", {
			"type": "button",
			"test": "data",
			"time": new Date().getTime()
		})
	}
}
app.init();