var app = {
	data: {
		"type": "tap message 1",
		"state": "ready"
	},
	init: function() {
		// app.socket = io.connect(SETTINGS.ip);
		// // app.record.init();
		// // return false;
		// app.socket.on("wait 2", app.wait);
		// app.socket.on("time paired 3", app.found_potential_pair);
		// app.socket.on("quarter check 5", app.quart_check);
		// app.socket.on("final check 7", app.final_check);
		// $("#button").click(app.clickButton);
		app.game.init();
	},

	clickButton: function(event) {
		if (screenfull.enabled && app.game.fullscreen == true) {
			screenfull.request();
		}
		app.data.time = new Date().getTime()
		if (app.data.state == "ready") {
			app.socket.emit("data", app.data)
			app.game.phase4.init();
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
		console.log("wait " + data);
		app.record.time = data;
		pr("wait " + data + " milliseconds");
		app.record.init();
		app.when_not_paired = window.setTimeout(function() {
			app.data.state = "ready"
			app.game.phase3.init("no_other_clicks");
			pr("");
		}, data);
	},
	found_potential_pair: function(data) {
		console.log("potential pair");
		window.clearTimeout(app.when_not_paired);
		$(document.body).addClass("tracking_motion");
		app.data.state = "recording";
		console.log("found potential pair");
		pr("found potential pair");
	},
	quart_check: function(data) {
		console.log("quarter check");
		pr("quater check possible " + data + " devices")
	},

	final_check: function(data) {
		console.log("final check");
		if (app.data.state == "recording") {
			pr("a result came back " + data.status);
			if (data.status == "success") {
				window.clearTimeout(app.wait_to_fail_obj);
				app.game.phase5.init(data.pairs);
				console.log(data);
				pr("a result came back success");
				app.data.state = "ready";
			} else {
				app.wait_to_fail_obj = window.setTimeout(app.wait_to_fail, app.record.time);
				pr("wait to fail");
			}
		}
	},
	wait_to_fail_obj: null,
	wait_to_fail: function() {
		pr("wait fail eneded");
		app.data.state = "ready";
		app.game.phase3.init("no one paired with you");
	},
	just_stop: function() {
		app.record.stop();
		app.game.phase3.init("warning JUST STOP");
	}
}

function pr(message) {
	$("#jsmessage")[0].innerHTML = message;
}






app.record = {
	time: 0,
	points: 128,
	interval_id: null,
	data: {
		"raw": [],
		"std": [null, null, null],
		"std_quart": [null, null, null]
	},
	data_temp: [0, 0, 0],
	init: function() {
		app.record.interval_id = setInterval(app.record.beat, 70);
		window.addEventListener('deviceorientation', app.record.on_orientaion_event, true);
	},
	beat: function(event) {
		console.log(app.record.data.raw.length);
		if (app.record.data.raw.length < app.record.points) {
			app.record.data.raw.push(app.zero.make(app.record.data_temp[0], app.record.data_temp[1], app.record.data_temp[2]));
		} else {
			app.record.final_message();
		}
	},
	on_orientaion_event: function(event) {
		if (!app.zero.d) {
			app.zero.d = {
				"a": event.alpha,
				"b": event.beta,
				"g": event.gamma
			}
		}
		app.record.data_temp = [event.alpha, event.beta, event.gamma]
	},
	message_quart: function() {
		app.record.data.std_quart = app.std_math.init();
		app.record.data.element = app.data.element;
		app.socket.emit("paired data 4", app.record.data);
	},
	final_message: function() {
		app.record.data.std = app.std_math.init();
		app.record.data.agr = app.agr.get(app.record.data.raw);
		app.record.data.element = app.data.element;
		// console.log(app.record.data);
		var outa = "";
		for (var a = 0, max = app.record.data.raw.length; a < max; ++a) {
			outa += "\n" + a + "\t" + app.record.data.raw[a].a + "\t" + app.record.data.raw[a].b + "\t" + app.record.data.raw[a].g + "\t"
		}
		app.record.data.table = outa;
		app.record.data.raw = [];
		console.log(app.record.data);
		app.socket.emit("paired data 6", app.record.data);
		app.record.stop();
	},
	stop: function() {
		clearInterval(app.record.interval_id);
		// window.removeEventListener('deviceorientation', app.record.on_orientaion_event, true);
		app.record.data = {
			"raw": [],
			"std": [null, null, null],
			"std_quart": [null, null, null]
		};
		app.zero.d = null;
		app.record.data_temp = [0, 0, 0];
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

app.agr = {
	// a: 0 b: 0.2007557698059329 		g: 0.37256911887217337 		hardish
	// a: 0 b: 0.012457420479415764 	g: 0.040596926855992914 	soft :/
	// a: 0 b: 0.018636809536515753 	g: 0.022497699238421744 	no movement
	// a: 0 b: 0.011800828369596714 	g: 0.014736137840923388 	soft
	// a: 0 b: 0.0071129340441632265	g: 0.01761660730906322		no movement
	// a: 0 b: 0.06381279301275204 		g: 0.09861663459377888		very aggresive
	get: function(raw) {
		if (typeof(raw) !== "object" && !raw.length) {
			alert("a non array was passed into app.agr");
			return false;
		}
		return app.agr.calc(raw);
	},
	calc: function(raw) {
		var out = [0, 0, 0],
			length = raw.length - 1,
			t = {
				"a": 0,
				"b": 0,
				"g": 0
			};
		// {"a": null,"b": null,"g": null}
		for (var a = 0, max = length; a < max; ++a) {
			t.a += Math.abs(raw[a].a - raw[a + 1].a);
			t.b += Math.abs(raw[a].b - raw[a + 1].b);
			t.g += Math.abs(raw[a].g - raw[a + 1].g);
		}
		out[0] = t.a / length
		out[1] = t.b / length
		out[2] = t.g / length
		return out;
	}
}