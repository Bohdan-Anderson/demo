var app = {
	data: {
		"type": "tap message 1",
		"state": "ready"
	},
	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		// app.record.init();
		// return false;
		app.socket.on("wait 2", app.wait);
		app.socket.on("time paired 3", app.found_potential_pair);
		app.socket.on("quarter check 5", app.quart_check);
		app.socket.on("final check 7", app.final_check);
		$("#button").click(app.clickButton);
	},

	clickButton: function(event) {
		app.data.time = new Date().getTime()
		if (app.data.state == "ready") {
			app.socket.emit("data", app.data)
			app.data.state = "wait"
			pr("pressed button waiting for server to respond");
		} else if (app.data.state == "wait") {
			pr("you are in the cue of clicks already");
		} else if (app.data.state == "recording") {
			pr("you are recording motion right now...");
		}

	},
	when_not_paired: null,
	wait: function(data) {
		console.log(data);
		pr("wait " + data + " milliseconds");
		app.record.init();
		app.when_not_paired = window.setTimeout(function() {
			app.data.state = "ready"
			pr("you can try to send again, no one click close in time to you");
		}, data);
	},
	found_potential_pair: function(data) {
		window.clearTimeout(app.when_not_paired);
		app.data.state = "recording";
		pr("found potential pair");
	},
	quart_check: function(data) {
		pr("quater check possible " + data + " devices")
	},
	final_check: function(data) {
		app.record.stop();
		pr("final check possible " + data + " devices")
		app.data.state = "ready";
	}
}

function pr(message) {
	$("#jsmessage")[0].innerHTML = message;
}






app.record = {
	time: 8000,
	data: {
		"raw": [],
		"std": [null, null, null],
		"std_quart": [null, null, null]
	},
	init: function() {
		// alert("starting to redcord");
		// app.record.beat_interval_object = setInterval(app.record.beat);
		window.addEventListener('deviceorientation', app.record.on_orientaion_event, true);
		app.record.message_quart_object = window.setTimeout(app.record.message_quart, app.record.time / 4);
		app.record.message_object = window.setTimeout(app.record.message, app.record.time);
	},
	on_orientaion_event: function(event) {
		var now = new Date();
		if (!app.record.previous && (now - app.record.previous < 100)) {
			return false;
		}
		if (!app.record.previous) {
			app.zero.d = {
				"a": event.alpha,
				"b": event.beta,
				"g": event.gamma
			}
		}
		app.record.previous = now;

		app.record.data.raw.push(app.zero.make(event.alpha, event.beta, event.gamma));
	},
	message_quart_object: null,
	message_quart: function() {
		console.log(app.record.data);
		app.record.data.std_quart = app.std_math.init();
		app.socket.emit("paired data 4", app.record.data);
	},
	message_object: null,
	message: function() {
		app.record.data.std = app.std_math.init();
		app.socket.emit("paired data 6", app.record.data);
	},
	stop: function() {
		window.removeEventListener('deviceorientation', app.record.on_orientaion_event, true);
		app.record.data = {
			"raw": [],
			"std": [null, null, null],
			"std_quart": [null, null, null]
		};
		app.record.previous = null;
	}
}

app.zero = {
	map: function(val, l1, h1, l2, h2) {
		return l2 + (h2 - l2) * (val - l1) / (h1 - l1);
	},
	make: function(a, b, g) {
		var rad_a = (Math.PI / 180) * (app.zero.d.a - a), //alpha: [0,360]
			rad_b = (Math.PI / 180) * (app.zero.d.b - (app.zero.map(b, -180, 180, 0, 360))), //beta: [-180,180]
			rad_g = (Math.PI / 180) * (app.zero.d.g - (app.zero.map(g, -90, 90, 0, 360))); //gamma: [-90,90]

		rad_a = Math.sin(rad_a);
		rad_b = Math.sin(rad_b);
		rad_g = Math.sin(rad_g);

		// return rad_a;
		return {
			"a": rad_a,
			"b": rad_b,
			"g": rad_g
		}
	}
}

app.std_math = {
	init: function() {
		app.std_math.d = {
			"mean": {
				"a": null,
				"b": null,
				"g": null
			},
			"variation": {
				"a": null,
				"b": null,
				"g": null
			}
		};
		app.std_math.mean();
		app.std_math.variance()
		console.log(app.std_math.d);
		return [Math.sqrt(app.std_math.d.variation.a), Math.sqrt(app.std_math.d.variation.b), Math.sqrt(app.std_math.d.variation.g)];
	},
	mean: function() {
		var length = app.record.data.raw.length;
		for (var i = 0; i < length; i++) {
			app.std_math.d.mean.a += app.record.data.raw[i].a;
			app.std_math.d.mean.b += app.record.data.raw[i].b;
			app.std_math.d.mean.g += app.record.data.raw[i].g;
		}
		app.std_math.d.mean.a = app.std_math.d.mean.a / length;
		app.std_math.d.mean.b = app.std_math.d.mean.b / length;
		app.std_math.d.mean.g = app.std_math.d.mean.g / length;
	},
	variance: function() {
		var length = app.record.data.raw.length;
		for (var i = 0; i < length; i++) {
			app.std_math.d.variation.a += ((app.record.data.raw[i].a - app.std_math.d.mean.a) * (app.record.data.raw[i].a - app.std_math.d.mean.a));
			app.std_math.d.variation.b += ((app.record.data.raw[i].b - app.std_math.d.mean.b) * (app.record.data.raw[i].b - app.std_math.d.mean.b));
			app.std_math.d.variation.g += ((app.record.data.raw[i].g - app.std_math.d.mean.g) * (app.record.data.raw[i].g - app.std_math.d.mean.g));
		}
		app.std_math.d.variation.a = app.std_math.d.variation.a / length;
		app.std_math.d.variation.b = app.std_math.d.variation.b / length;
		app.std_math.d.variation.g = app.std_math.d.variation.g / length;
	}
}


app.init();