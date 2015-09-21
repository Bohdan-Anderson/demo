var fs = require('fs');

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
		pairs: [], //it should be that     fakeList, //
		paired: null,
		user_data: null,
		check: function() {
			if (!out.pairs.length) {
				return false;
			}

			var msg = out.this_socket.id + "<br>";

			var ud = out.user_data, // user data
				cd = null, //current data
				g_sum = 99,
				sum_winner = null,
				g_std = null,
				std_winner = null;
			for (var a = 0, max = out.pairs.length; a < max; ++a) {
				cd = out.pairs[a].possible_pairs.user_data;

				loc_sum = Math.abs(ud.sum[0] - cd.sum[0]) + Math.abs(ud.sum[1] - cd.sum[1]) + Math.abs(ud.sum[2] - cd.sum[2])
				if (loc_sum < g_sum) {
					g_sum = loc_sum;
					sum_winner = out.pairs[a];
				}

				loc_sum = Math.abs(ud.sum[0] - cd.sum[0]) + Math.abs(ud.sum[1] - cd.sum[1]) + Math.abs(ud.sum[2] - cd.sum[2])
				if (loc_sum < g_sum) {
					g_sum = loc_sum;
					sum_winner = out.pairs[a];
				}



				msg += cd.id + "<br>";

			}

			var time = String(new Date().getTime())
			write_data(out.user_data, time, out.this_socket.id, out.this_socket.handshake.headers["user-agent"]);
			out.this_socket.emit("paired", msg)
			for (var a = 0, max = out.pairs.length; a < max; ++a) {
				out.pairs[a].emit("paired", msg)
				write_data(
					out.pairs[a].possible_pairs.user_data,
					time,
					out.pairs[a].id,
					out.pairs[a].handshake.headers["user-agent"])
			}

		}
		// message_pairs: function(message_name, data) {
		// 	console.log("device: \t" + out.this_socket.id);
		// 	if (!out.pairs.length) {
		// 		console.log(out.this_socket.id + " found no pairs");
		// 		return false;
		// 	}
		// 	out.this_socket.emit(message_name, data)
		// 	for (var a = 0, max = out.pairs.length; a < max; ++a) {
		// 		console.log(" --\t\t" + out.pairs[a].id);
		// 		out.pairs[a].emit(message_name, data)
		// 	}
		// },
		// message_winners: function(message_name, data) {
		// 	console.log("winners: \t" + out.this_socket.id);
		// 	console.log("\t\t" + out.paired.id);
		// 	out.this_socket.emit(message_name, data);
		// 	out.paired.emit(message_name, data);
		// },
		// message_losers: function(message_name, data) {
		// 	for (var a = 0, max = out.pairs.length; a < max; ++a) {
		// 		if (out.pairs[a].id != out.paired.id) {
		// 			out.pairs[a].emit(message_name, data)
		// 		}
		// 	}
		// },
		// quarter_check: function() {
		// 	console.log("\nquarter check")
		// 	out.message_pairs("quarter check 5", out.pairs.length);
		// },

		// check: function() {
		// 	console.log("\n\n\nfinal check " + out.this_socket);

		// 	out.paired = out.find_closests_std(out.this_socket, out.pairs, 0.26, 0.1);

		// 	if (!out.paired) {
		// 		// out.this_socket.emit("final check 7", {
		// 		// 	"status": "failed"
		// 		// });

		// 		out.message_pairs("final check 7", {
		// 			"status": "failed"
		// 		});
		// 		// out.this_socket.pairing_data = null;
		// 		return false;
		// 	}

		// 	out.paired.pairing_data.taken = true;

		// 	console.log(out.this_socket.pairing_data.std)
		// 	console.log(out.paired.pairing_data.std)
		// 	if (out.pairs.length >= 1) {
		// 		out.message_winners("final check 7", {
		// 			"status": "success",
		// 			"pairs": [out.this_socket.pairing_data.element, out.paired.pairing_data.element]
		// 		});
		// 		out.message_losers("final check 7", {
		// 			"status": "failed"
		// 		})
		// 		// out.this_socket.pairing_data = null;
		// 	} else {
		// 		console.log("\n\n\n SOMETHING WENT VERY WRONG \n\n\n");
		// 		out.message_pairs("final check 7", false);
		// 	}

		// },
		// find_closests_std: function(ref, list, limit, agr) {
		// 	var out = false,
		// 		arg_out = false,
		// 		min = limit || 99999999,
		// 		loc = 0,
		// 		agr_min = agr,
		// 		agr_loc = 0;

		// 	console.log("--\t" + ref.id)
		// 	// console.log(ref.pairing_data.table)
		// 	for (var a = 0, max = list.length; a < max; ++a) {

		// 		// console.log(list[a].pairing_data.table)
		// 		if (list[a].pairing_data && !list[a].pairing_data.taken && list[a].id != ref.id) {
		// 			agr_loc = 0;
		// 			agr_loc += Math.abs(ref.pairing_data.agr[0] - list[a].pairing_data.agr[0]);
		// 			agr_loc += Math.abs(ref.pairing_data.agr[1] - list[a].pairing_data.agr[1]);
		// 			agr_loc += Math.abs(ref.pairing_data.agr[2] - list[a].pairing_data.agr[2]);
		// 			console.log(list[a].id + "\t agr\t " + agr_loc);
		// 			if (agr_loc < agr_min) {
		// 				agr_min = agr_loc;
		// 				arg_out = list[a];
		// 			}

		// 			loc = 0;
		// 			loc += Math.abs(ref.pairing_data.std[0] - list[a].pairing_data.std[0]);
		// 			loc += Math.abs(ref.pairing_data.std[1] - list[a].pairing_data.std[1]);
		// 			loc += Math.abs(ref.pairing_data.std[2] - list[a].pairing_data.std[2]);
		// 			console.log(list[a].id + "\t std\t " + loc);
		// 			if (loc < min) {
		// 				min = loc;
		// 				out = list[a]
		// 			}

		// 		} else {
		// 			console.log(list[a].id + " no data")
		// 		}
		// 	}
		// 	console.log("\nsum agle somet of: " + min + "");
		// 	console.log("sum difference of: " + agr_min + "\n");
		// 	// console.log("agr choose " + arg_out + "")
		// 	return out;
		// }
	};

	return out;
}



var time = {
	point: [], // data is store in there [[time,socket],[time,socket],[time,socket]]
	time_size: 1500,
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


		socket.on('join queue', function(data) {
			console.log("\t\t" + socket.id + " joined queue")
			socket.emit("joined queue", time.time_size);
			socket.messaged_to_continue = false;
			socket.possible_pairs = possible_pairs_root(socket);

			if (time.point.length) {
				for (var a = 0, max = time.point.length; a < max; ++a) {
					if (time.point[a][1]["id"] != socket["id"]) {
						socket.possible_pairs.pairs.push(time.point[a][1]);
						if (!time.point[a][1].messaged_to_continue) {
							time.point[a][1].emit("continue to record", socket.id);
							time.point[a][1].messaged_to_continue = true;
						}
						if (!socket.messaged_to_continue) {
							socket.emit("continue to record", "continue");
						}
					} else {
						time.point.splice(a, 1);
						a -= 1;
						max -= 1;
					}
				}
				// socket.possible_pairs.message_pairs("time paired 3", "worked!");
			}


			time.point.push([new Date().getTime(), socket]);

		});

		socket.on('recording finished', function(data) {
			console.log("\t" + socket.id + " sent final data");
			socket.possible_pairs.user_data = data;
			socket.possible_pairs.check();
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
					console.log("\t\t" + time.point[i][1].id + " left queue")
					time.point.splice(i, 1);
					i -= 1;
				}
			};
		}
	}
}





function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

var write_data_parse = function(data) {
	var out = "";
	// iterate if it's an array
	if (data != null && typeof(data) == "object" && data.length) {
		for (var a = 0, max = data.length; a < max; ++a) {
			out += "\t" + write_data_parse(data[a]);
		}
		out += "\n";
	} else if (typeof(data) == "object") {
		// iterate if it's an object

		for (var key in data) {
			out += "\n " + key;
			out += "\n" + write_data_parse(data[key]);
		}
	} else {
		// return if it's a string	
		if (isNumeric(data)) {
			data = Math.floor(data * 10000) / 10000;
		}
		out = data;
	}
	return out;
}

var write_data = function(data, time, id, headers) {
	if (!fs.existsSync("data/" + time)) {
		fs.mkdirSync("data/" + time);
	}
	fs.writeFile("data/" + time + "/" + String(id), headers + "\n" + write_data_parse(data), function(err) {
		if (err) return console.log(err);
		console.log(id);
	});
}


exports.game = game;