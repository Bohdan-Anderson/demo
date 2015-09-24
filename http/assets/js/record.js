// TODO figure out better way of determing interval
// https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/interval


var REC = {
	ec: 256, //enc count
	temp: null,
	zero: null,
	raw: null
};

// start beat
// start phone moves updater
// clear the data
REC.start = function() {
	REC.temp = null;
	REC.zero = null;
	REC.raw = null;
	console.log("start recording");
	window.addEventListener('deviceorientation', REC.phone_moves_updater, true);
	REC.beat_holder = setInterval(REC.beat, 16);
};

REC.phone_moves_updater = function(event) {
	if (!REC.zero) {
		// REC.zero = [event.alpha, CALC.zero_data_map(event.beta, -180, 180, 0, 360), CALC.zero_data_map(event.gamma, -90, 90, 0, 360)]
		REC.zero = [event.alpha, event.beta, event.gamma];
	}

	REC.temp = [event.alpha, event.beta, event.gamma]
}

// records the current phones location from the temp move
REC.beat_holder = null;
REC.beat_writen = 10;
REC.beat = function() {
	if (REC.temp) {
		if (!REC.raw) {
			REC.raw = [CALC.zero_data(REC.temp, REC.zero)];
		} else {
			REC.beat_print();
			REC.raw.push(CALC.zero_data(REC.temp, REC.zero));
		}
		if (REC.raw.length > REC.ec) {
			REC.stop();
		}
	}
};

// print's to the 10th percent of current beatage
REC.beat_print = function() {
	var w = Math.floor(REC.raw.length / REC.ec * 10);
	if (w != REC.beat_writen) {
		REC.beat_writen = w;
		console.log(w + "0%");
	}
}

// send data to server
// stop beat
// stop phone moves updater
// reset zero
REC.stop = function() {
	console.log("stoped beat");
	window.removeEventListener('deviceorientation', REC.phone_moves_updater, true);
	clearInterval(REC.beat_holder);

	var to_send = {
		"standard_deviation": CALC.standard_deviation(REC.raw),
		"slope_aggression": CALC.slope_aggresion(REC.raw),
		"sum": CALC.sum(REC.raw),
		"raw": REC.raw,
		"element": Cookies.get("element")
	}

	PAIR.OUT.finished_recording(to_send)
}

REC.stop_failed = function() {
	console.log("stoped beat by fail");
	APP.print_data(REC.raw);
	window.removeEventListener('deviceorientation', REC.phone_moves_updater, true);
	clearInterval(REC.beat_holder);
}