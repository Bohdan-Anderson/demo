var CALC = {}

CALC.add_weight = function(el, id, weight) {
	if (!el || !id) {
		return false;
	}
	if (el.weights[id]) {
		el.weights[id] += weight;
	} else {
		el.weights[id] = weight;
	}
}

CALC.standard_deviation = function(main, list, min_variance, weight) {
	if (typeof(list) !== "object" && !list.length) {
		console.log("\n\nA list was not passed to standard deviation\n\n");
		return null;
	}
	if (!list || list.length <= 0) {
		return null;
	}
	console.log("\nStandard deviation difference");
	var winner = null,
		length = list.length,
		ud = main.user_data.standard_deviation.standard_deviation,
		cd = null, //current data
		temp = null,
		min_variance = min_variance;
	for (var a = 0; a < length; a++) {
		if (list[a].has_been_sent_win_message || !list[a].possible_pairs.user_data) {
			continue;
		}
		cd = list[a].possible_pairs.user_data.standard_deviation.standard_deviation;
		temp = Math.abs(ud[0] - cd[0]);
		temp += Math.abs(ud[1] - cd[1]);
		temp += Math.abs(ud[2] - cd[2]);
		console.log(temp);
		if (temp < min_variance) {
			min_variance = temp;
			winner = list[a];
		}
	}

	CALC.add_weight(winner, main.this_socket.id, weight)
	return winner;
}

CALC.slope_aggression = function(main, list, min_variance, weight) {
	if (typeof(list) !== "object" && !list.length) {
		console.log("\n\nA list was not passed to Slope aggresion\n\n");
		return null;
	}
	if (!list || list.length <= 0) {
		return null;
	}
	console.log("\nSlope aggresion");
	var winner = null,
		length = list.length,
		ud = main.user_data.slope_aggression,
		cd = null, //current data
		temp = null,
		min_variance = min_variance;
	for (var a = 0; a < length; a++) {
		if (list[a].has_been_sent_win_message || !list[a].possible_pairs.user_data) {
			continue;
		}
		cd = list[a].possible_pairs.user_data.slope_aggression;
		temp = Math.abs(ud[0] - cd[0]);
		temp += Math.abs(ud[1] - cd[1]);
		temp += Math.abs(ud[2] - cd[2]);
		console.log(temp);
		if (temp < min_variance) {
			min_variance = temp;
			winner = list[a];
		}
	}
	CALC.add_weight(winner, main.this_socket.id, weight)
	return winner;
}

CALC.sum = function(main, list, min_variance, weight) {
	if (typeof(list) !== "object" && !list.length) {
		console.log("\n\nA list was not passed to SUM\n\n");
		return null;
	}
	if (!list || list.length <= 0) {
		return null;
	}
	console.log("\nSUM");
	var winner_a = null,
		winner_b = null,
		winner_g = null,
		length = list.length,
		ud = main.user_data.sum,
		cd = null, //current data
		t_a = 0,
		t_b = 0,
		t_g = 0,
		min_a = min_variance,
		min_b = min_variance,
		min_g = min_variance;
	for (var a = 0; a < length; a++) {
		if (list[a].has_been_sent_win_message || !list[a].possible_pairs.user_data) {
			continue;
		}
		cd = list[a].possible_pairs.user_data.sum;
		t_a = Math.abs(ud[0] - cd[0]);
		t_b = Math.abs(ud[1] - cd[1]);
		t_g = Math.abs(ud[2] - cd[2]);

		if (t_a < min_a) {
			console.log(t_a)
			min_a = t_a;
			winner_a = list[a];
		}
		if (t_b < min_b) {
			console.log(t_b)
			min_b = t_b;
			winner_b = list[a];
		}
		if (t_g < min_g) {
			console.log(t_g)
			min_g = t_g;
			winner_g = list[a];
		}
	}
	CALC.add_weight(winner_a, main.this_socket.id, weight / 3)
	CALC.add_weight(winner_b, main.this_socket.id, weight / 3)
	CALC.add_weight(winner_g, main.this_socket.id, weight / 3)
	return winner_a;
}


// out
// either a socket or null
// input
// list of all the sockets
// id of the current element > we use it to retrive the weight value of each socket
// total is what the grand total is weighed out of
CALC.greatest_weighed = function(list, id, total) {
	if (typeof(list) !== "object" && !list.length) {
		console.log("\n\nA list was not passed to SUM\n\n");
		return null;
	}
	if (!list || list.length <= 0) {
		return null;
	}
	var g = 0,
		out = null;
	for (var a = 0; a < list.length; a++) {
		if (list[a].weights[id] > g) {
			g = list[a].weights[id];
			out = list[a]
		}
	}

	// we test to see if the winner is stronger than half the tests
	if (g > total / 2) {
		console.log("winner Weight: " + g);
		return out
	}
	return null;
}


// >> list of devices
// if device has no data
// add this socket to the device's possible pairs
CALC.add_no_data = function(list, current_socket) {
	if (typeof(list) !== "object" && !list.length) {
		console.log("\n\nA list was not passed to SUM\n\n");
		return null;
	}
	if (!list || list.length <= 0) {
		return null;
	}

	var length = list.length;
	for (var a = 0; a < length; a++) {
		if (!list[a].possible_pairs.user_data) {
			list[a].possible_pairs.pairs.push(current_socket);
		}
	}


}


exports.CALC = CALC;