var game = {
	io: null,
	init: function(socket) {
		game.io = socket;
		time.init();
	}
}





var possible_pairs_root = function(main_socket) {
	var out = {
		this_socket: main_socket,
		pairs: [],
		message_pairs: function(message_name, data) {
			console.log("device: \t" + out.this_socket.id);
			if (!out.pairs.length) {
				console.log(out.this_socket.id + " found no pairs");
				return false;
			}
			out.this_socket.emit(message_name, data)
			for (var a = 0, max = out.pairs.length; a < max; ++a) {
				console.log(" --\t\t" + out.pairs[a].id);
				out.pairs[a].emit(message_name, data)
			}
		},
		quarter_check: function() {
			console.log("\nquarter check")
			out.message_pairs("quarter check 5", out.pairs.length);
		},
		check: function() {
			console.log("\nfinal check\n\n")
			console.log(out.this_socket.pairing_data.std);
			// console.log("main:\t" + out.this_socket.pairing_data.std[0] + " " + out.this_socket.pairing_data.std[1] + " " + out.this_socket.pairing_data.std[2]);
			for (var a = 0, max = out.pairs.length; a < max; ++a) {
				console.log(out.pairs[a].pairing_data.std);
				// console.log("out:\t" + out.pairs[a].pairing_data.std[0] + " " + out.pairs[a].pairing_data.std[1] + " " + out.pairs[a].pairing_data.std[2]);
			}
			out.message_pairs("final check 7", out.pairs.length);

		}

	};

	return out;
}



var time = {
	point: [], // data is store in there [[time,socket],[time,socket],[time,socket]]
	time_size: 2000,
	checker_interval: 100,
	init: function() {
		game.io.sockets.on('connection', time.connect);
		// the checker make a function that loops through the time.point
		// if the element don't have the same socket id it pairs them.
		// if the element has the same socket id, it removes it and adds an updated object
		time.checker.init();
	},
	// when we get data of a certain type we test for pairs
	// we test against the time.point array
	connect: function(socket) {
		socket.on('data', function(data) {
			if (data.type == "tap message 1") {
				// we ask the client to wait till they are out of the time pairing zome
				socket.emit("wait 2", time.time_size);
				if (time.point.length) {
					socket.possible_pairs = possible_pairs_root(socket);
					for (var a = 0, max = time.point.length; a < max; ++a) {
						if (time.point[a][1]["id"] != socket["id"]) {
							socket.possible_pairs.pairs.push(time.point[a][1]);
						} else {
							time.point.splice(a, 1);
							a -= 1;
							max -= 1;
						}
					}
					console.log("\ninitial pairing")
					socket.possible_pairs.message_pairs("time paired 3", "worked!");
				};
				time.point.push([new Date().getTime(), socket]);
			};
		});
		socket.on('paired data 4', function(data) {
			// console.log("\n\t\tquart data")
			// console.log(data["raw"]);
			socket.pairing_data = data;
			if (socket.possible_pairs) {
				socket.possible_pairs.quarter_check();
			};
		});
		socket.on('paired data 6', function(data) {
			// console.log("\t\tfinal data")
			// console.log(data["raw"]);
			socket.pairing_data = data;
			if (socket.possible_pairs) {
				socket.possible_pairs.check();
			};
		});
	},

	checker: {
		looptarget: null,
		init: function() {
			time.checker.looptarget = setInterval(time.checker.loop, time.checker_interval);
		},
		loop: function() {
			var t = new Date().getTime();
			for (var i = time.point.length - 1; i >= 0; i--) {
				// console.log("\t\t" + time.point[i][0])
				if (time.point[i][0] + time.time_size < t) {
					time.point.splice(i, 1);
					i -= 1;
				}
			};
		}
	}
}

exports.game = game;