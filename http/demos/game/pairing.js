var PAIR = {
	D: {
		element: null
	},
	socket: null,
	init: function() {
		console.log("pairing init")
		if (!PAIR.socket) {
			console.log("pairing no socket init")
			PAIR.socket = io.connect(SETTINGS.ip);

			/*
				>> join cue
				<< wait x time
				<< yes you did pair
				<< no do did not pair
				>> final data
				<< paired
			*/
			PAIR.socket.on("joined queue", PAIR.IN.joined_queue);
			PAIR.socket.on("continue to record", PAIR.IN.continue_to_record); // tap paired... found an pair for you...
			PAIR.socket.on("paired", PAIR.IN.paired);

			$("#pairing_button").click(PAIR.OUT.joining_queue);
		}
	},
	IN: {},
	OUT: {},
	WAIT: {}
}


/*
tap > responce
	we being recording, waiting for a responce if some one found us
	once we reach the end of the tap responce > we found are others
	we record our data and send it in  we return the data
	yes 	there was some one close to your tap
				we don't cancle everything else we were donig
	no		there was no other taps
				the server keeps us in the waiting list
				when we lease the list the server will let us know that no one found us
				we wait the responce saying no one found us

				we might get multiple call backs from multiple people...

tap responce > no others
	we cancle the recording and do not send the data
	we go back to the initial page of trying to pair with people

tap responce > others found us
	we record our data and send it in

tap responce > we found are others
	we record our data and send it in 

	it doesn't matter if some one else found us or we found some one else

answer wait
	this cycle starts after we report our data
	we wait for twice the lenght of the recording cycle

answer wait > recive pairing
	we could recive multiple just go with the first
	in the message will be the icon to be display

answer wait > times out
	we say we failed at the pairing
	we go back to the initial page of trying to pair with people


*/


var REC = {
	D: {

	},
	ec: 80, //enc count
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
	REC.beat_holder = setInterval(REC.beat, 70);
};

REC.phone_moves_updater = function(event) {
	if (!REC.zero) {
		REC.zero = [event.alpha, event.beta, event.gamma]
	}

	REC.temp = [event.alpha, event.beta, event.gamma]
}

// records the current phones location from the temp move
REC.beat_holder = null;
REC.beat_writen = 10;
REC.beat = function() {
	if (REC.temp) {
		if (!REC.raw) {
			REC.raw = [REC.temp];
		} else {
			REC.beat_print();
			REC.raw.push(REC.temp);
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

	PAIR.OUT.finished_recording(REC.raw)

}

REC.stop_failed = function() {
	console.log("stoped beat by fail");
	window.removeEventListener('deviceorientation', REC.phone_moves_updater, true);
	clearInterval(REC.beat_holder);
}









// we send data to the server
// we start the tap queue
// we go to phase 4
// we bein recording the data
PAIR.OUT.joining_queue = function(event) {
	console.log("joining queue");
	APP.pr("tapped!");
	PAIR.socket.emit("join queue", PAIR.D)
	REC.start();
	GAME.phase4.init();
};

// we geing the in tap que
PAIR.IN.joined_queue = function(data) {
	console.log("joined queue, wait " + data + " before exiting");
	PAIR.D.wait_time = data;
	PAIR.WAIT.in_tap_queue_holder = window.setTimeout(PAIR.WAIT.in_tap_queue, data * 2)
};

// we stop the recording of data
// go back to phase 3
PAIR.WAIT.in_tap_queue_holder = null
PAIR.WAIT.in_tap_queue = function() {
	console.log("cancle queue")
	REC.stop_failed();
	GAME.phase3.init("not tap close in time");
};


// there are others in the queue with us
// we cancle in tap queue 
PAIR.IN.continue_to_record = function(data) {
	console.log("continue to record")
	APP.pr("potential " + data);
	window.clearTimeout(PAIR.WAIT.in_tap_queue_holder);
};

// gets called when we reach the last beat of the recording
// send our data to the server
PAIR.OUT.finished_recording = function(data) {
	console.log("sending this data...")
	// console.log(data)
	PAIR.socket.emit("recording finished", data)
	PAIR.WAIT.in_data_queue_holder = window.setTimeout(PAIR.WAIT.in_data_queue, PAIR.D.wait_time * 3);
};

// if we don't stop we fail
// go back to phase 3 with error message of no matting
PAIR.WAIT.in_data_queue_holder = null
PAIR.WAIT.in_data_queue = function() {
	GAME.phase3.init("no one paired with you");
};

// we paired
// go to phase 5
// pass the winning icon
// cancle in data queue
PAIR.IN.paired = function(data) {
	window.clearTimeout(PAIR.WAIT.in_data_queue_holder);
	APP.pr("MATCHED!");
	GAME.phase5.init(data);
};