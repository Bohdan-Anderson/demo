var app = {

	data: {
		type: "sway",
	},
	deviceorientation_previous: new Date(),
	f: 90,
	min: 180,
	max: 0,

	init: function() {
		console.log("starting");
		app.socket = io.connect(SETTINGS.ip);
		window.addEventListener("deviceorientation", app.onOrientaionEvent, true);
		setInterval(app.beat, 500);
	},

	beat: function(event) {
		app.socket.emit("data", app.data);
	},

	setBackgroundColour: function(percent, c1, c2) {
		var n = []
		for (var i = 0; i <= 2; ++i) {
			n.push(parseInt(c2[i] + ((c1[i] - c2[i]) * percent)));
		};
		$("body").css("background-color", "rgb(" + n[0] + "," + n[1] + "," + n[2] + ")");
	},

	onOrientaionEvent: function(event) {
		var now = new Date();
		if (now - app.deviceorientation_previous < 100) {
			return false;
		}
		app.deviceorientation_previous = now;

		// slowly transition to the new value
		var diff = app.f - Math.abs(event.beta);
		app.f = parseInt((app.f - (diff / 2)) * 100) / 100;;
		app.data.value = app.f;

		// find new min and maxs
		if (app.max < app.f) {
			app.max = app.f;
		} else if (app.min > app.f) {
			app.min = app.f;
		}


		app.setBackgroundColour((app.f - app.min) / (app.max - app.min), [255, 255, 255], [0, 0, 0]);

		out = parseInt((app.f - app.min) / (app.max - app.min) * 100) / 100;
		app.data.percentage = out;
		//reset the max and mins as soon as we can
		app.min += 0.1;
		app.max -= 0.1;
	}
}
app.init();