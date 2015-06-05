var app = {

	data: {
		type: "alldata",
	},
	deviceorientation_previous: new Date(),
	devicemotion_previous: new Date(),

	init: function() {
		console.log("starting");
		app.socket = io.connect(SETTINGS.ip);
		window.addEventListener("deviceorientation", app.onOrientaionEvent, true);
		window.addEventListener("orientationchange", app.orientation, false);
		window.addEventListener('devicemotion', app.devicemotion, false);
		setInterval(app.beat, 500);
	},

	beat: function(event) {
		app.socket.emit("data", app.data);
	},

	orientation: function(event) {
		app.data.orientation = window.orientation;
	},

	onOrientaionEvent: function(event) {
		var now = new Date();
		if (now - app.deviceorientation_previous < 100) {
			return false;
		}
		app.deviceorientation_previous = now;
		app.data.deviceorientation_a = event.absolute;
		app.data.deviceorientation_x = parseInt(event.gamma * 100) / 100;
		app.data.deviceorientation_y = parseInt(event.alpha * 100) / 100;
		app.data.deviceorientation_z = parseInt(event.beta * 100) / 100;

	},
	devicemotion: function(event) {
		var now = new Date();
		if (now - app.devicemotion_previous < 100) {
			return false;
		}
		app.devicemotion_previous = now;
		if (event.acceleration) {
			app.data.devicemotion_a_x = event.acceleration.x;
			app.data.devicemotion_a_y = event.acceleration.y;
			app.data.devicemotion_a_z = event.acceleration.z;
		}
		if (event.accelerationIncludingGravity) {
			app.data.devicemotion_ag_x = event.accelerationIncludingGravity.x;
			app.data.devicemotion_ag_y = event.accelerationIncludingGravity.y;
			app.data.devicemotion_ag_z = event.accelerationIncludingGravity.z;
		}
		if (event.rotation) {
			app.data.devicemotion_ar_x = event.rotation.alpha;
			app.data.devicemotion_ar_y = event.rotation.beta;
			app.data.devicemotion_ar_z = event.rotation.gamma;
		}
		app.data.devicemotion_interval = event.interval;
	}
}
app.init();