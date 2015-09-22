var write_data = require('./write_data').write_data;
var CALC = require('./calc').CALC;


var fake_socket_data = function() {
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


var OBJ = function(main_socket) {
	var out = {
		this_socket: main_socket,
		pairs: [], //it should be that     fakeList, //
		paired: null,
		user_data: null,
		check: function() {
			if (!out.pairs.length) {
				return false;
			}

			var msg = out.this_socket.id + "<br>",
				cd = null;

			var winner = out.find_matches();
			// message the winners
			if(winner){
				out.this_socket.emit("paired", msg)
				winner.emit("paired", msg)
			}

			for (var a = 0, max = out.pairs.length; a < max; ++a) {
				cd = out.pairs[a].possible_pairs.user_data;
				msg += cd.id + "<br>";
			}

			var time = String(new Date().getTime())
			console.log(out.this_socket.id);
			write_data(out.user_data, time, out.this_socket.id, out.this_socket.handshake.headers["user-agent"]);

			for (var a = 0, max = out.pairs.length; a < max; ++a) {
				write_data(
					out.pairs[a].possible_pairs.user_data,
					time,
					out.pairs[a].id,
					out.pairs[a].handshake.headers["user-agent"])
			}
		},
		find_matches: function() {
			var ud = out.user_data, // user data
				cd = null, //current data
				// (compaired against, list of the pairs, minimun for winner, weight)
				std_winner = CALC.standard_deviation(out, out.pairs, 0.5, 1),
				agr_winner = CALC.slope_aggression(out, out.pairs, 0.5, 1),
				sum_winner = CALC.sum(out, out.pairs, 50, 2);

			console.log("\n\nWinner...");

			var winner = CALC.greatest_weighed(out.pairs, out.this_socket.id);
			if (winner) {
				console.log(winner.id);
			}
			console.log("end of winners\n--------\n\n");
			return winner;
		}
	};

	return out;
}

exports.SOCKET_OBJECT = OBJ;