var game = {
	io: null,
	init: function(socket) {
		game.io = socket;
		time.init();
	}
}



var use_fake_sockets = true;
var fakeSocket = function() {
	var out = {
		"pairing_data": {
			"std": [Math.random(), Math.random(), Math.random()],
			"agr": [Math.random(), Math.random(), Math.random()],
			"table": "fake table",
			"element": "human"
		},
		emit: function(x, y) {
			// console.log("fake emmit: " + x + " " + y);
		},
		id: (Math.floor(Math.random() * 100) + " fake id for a fake socket")
	}
	return out;
}

// var fakeList = [fakeSocket(), fakeSocket(), fakeSocket()];
var possible_pairs_root = function(main_socket) {
	var out = {
		this_socket: main_socket,
		pairs: [fakeSocket(), fakeSocket()], //it should be that     fakeList, //
		paired: null,
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
		message_winners: function(message_name, data) {
			console.log("winners: \t" + out.this_socket.id);
			console.log("\t\t" + out.paired.id);
			out.this_socket.emit(message_name, data);
			out.paired.emit(message_name, data);
		},
		message_losers: function(message_name, data) {
			for (var a = 0, max = out.pairs.length; a < max; ++a) {
				if (out.pairs[a].id != out.paired.id) {
					out.pairs[a].emit(message_name, data)
				}
			}
		},
		quarter_check: function() {
			console.log("\nquarter check")
			out.message_pairs("quarter check 5", out.pairs.length);
		},

		check: function() {
			console.log("\n\n\nfinal check " + out.this_socket);

			out.paired = out.find_closests_std(out.this_socket, out.pairs, 0.26, 0.1);

			if (!out.paired) {
				// out.this_socket.emit("final check 7", {
				// 	"status": "failed"
				// });

				out.message_pairs("final check 7", {
					"status": "failed"
				});
				// out.this_socket.pairing_data = null;
				return false;
			}

			out.paired.pairing_data.taken = true;

			console.log(out.this_socket.pairing_data.std)
			console.log(out.paired.pairing_data.std)
			if (out.pairs.length >= 1) {
				out.message_winners("final check 7", {
					"status": "success",
					"pairs": [out.this_socket.pairing_data.element, out.paired.pairing_data.element]
				});
				out.message_losers("final check 7", {
					"status": "failed"
				})
				// out.this_socket.pairing_data = null;
			} else {
				console.log("\n\n\n SOMETHING WENT VERY WRONG \n\n\n");
				out.message_pairs("final check 7", false);
			}

		},
		find_closests_std: function(ref, list, limit, agr) {
			var out = false,
				arg_out = false,
				min = limit || 99999999,
				loc = 0,
				agr_min = agr,
				agr_loc = 0;

			console.log("--\t" + ref.id)
			// console.log(ref.pairing_data.table)
			for (var a = 0, max = list.length; a < max; ++a) {

				// console.log(list[a].pairing_data.table)
				if (list[a].pairing_data && !list[a].pairing_data.taken && list[a].id != ref.id) {
					agr_loc = 0;
					agr_loc += Math.abs(ref.pairing_data.agr[0] - list[a].pairing_data.agr[0]);
					agr_loc += Math.abs(ref.pairing_data.agr[1] - list[a].pairing_data.agr[1]);
					agr_loc += Math.abs(ref.pairing_data.agr[2] - list[a].pairing_data.agr[2]);
					console.log(list[a].id + "\t agr\t " + agr_loc);
					if (agr_loc < agr_min) {
						agr_min = agr_loc;
						arg_out = list[a];
					}

					loc = 0;
					loc += Math.abs(ref.pairing_data.std[0] - list[a].pairing_data.std[0]);
					loc += Math.abs(ref.pairing_data.std[1] - list[a].pairing_data.std[1]);
					loc += Math.abs(ref.pairing_data.std[2] - list[a].pairing_data.std[2]);
					console.log(list[a].id + "\t std\t " + loc);
					if (loc < min) {
						min = loc;
						out = list[a]
					}

				} else {
					console.log(list[a].id + " no data")
				}
			}
			console.log("\nsum agle somet of: " + min + "");
			console.log("sum difference of: " + agr_min + "\n");
			// console.log("agr choose " + arg_out + "")
			return out;
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
				socket.possible_pairs = null;
				// we ask the client to wait till they are out of the time pairing zome
				socket.emit("wait 2", time.time_size * 2);
				if (time.point.length) {
					socket.possible_pairs = possible_pairs_root(socket);
					for (var a = 0, max = time.point.length; a < max; ++a) {
						if (time.point[a][1]["id"] != socket["id"]) {
							// console.log("\n\nFOUND AN PAIR!!!\n\n" + socket.id + " and " + time.point[a][1].id + "\n\n")
							socket.possible_pairs.pairs.push(time.point[a][1]);
						} else {
							time.point.splice(a, 1);
							a -= 1;
							max -= 1;
						}
					}
					socket.possible_pairs.message_pairs("time paired 3", "worked!");
				} else if (use_fake_sockets) {
					socket.possible_pairs = possible_pairs_root(socket);
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
			if (socket.pairing_data) {
				socket.emit("stop", {});
			};
			socket.pairing_data = data;
			if (!socket.possible_pairs || !socket.possible_pairs.pairs) {
				console.log("final check no pair " + socket.id);
				return false;
			}
			if (socket.possible_pairs && socket.possible_pairs.pairs.length) {
				console.log("\n\nfinalcheck");
				// socket.possible_pairs.print_tables();
				// console.log(socket.pairing_data.table);
				// console.log(socket.possible_pairs.pairs[0].pairing_data.table);
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