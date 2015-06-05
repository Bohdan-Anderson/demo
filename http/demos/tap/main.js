var app = {
	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		app.previous = new Date();
		// window.addEventListener("deviceorientation", app.onOrientaionEvent, true);
		window.addEventListener("devicemotion", app.onMotionEvent, true);
		app.mvgAvg = null;
		app.wrapper = $("#wrapper");

	},

	onOrientaionEvent: function(event) {
		var now = new Date();
		if (now - app.previous < 500) {
			return false;
		}
		app.previous = now;
		app.socket.emit("data", {
			"x": event.gamma,
			"y": event.alpha,
			"z": event.beta
		})
	},

	onMotionEvent: function(event) {
		var z = event.accelerationIncludingGravity.z;
		event.preventDefault();
		app.mvgAvg = (z * 0.4) + (app.mvgAvg * (1 - 0.4));

		if ((Math.abs(app.mvgAvg - z)) > 6) {
			app.wrapper.addClass("active");
			app.socket.emit("data", {
				"avg": app.mvgAvg,
				"type": "tap"
			});
		} else {
			app.wrapper.removeClass("active");
		}
	}

}
app.init();