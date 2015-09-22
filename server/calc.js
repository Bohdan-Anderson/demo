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
	var winner = null,
		length = list.length,
		ud = main.user_data.sum,
		cd = null, //current data
		temp = null,
		min_variance = min_variance;
	for (var a = 0; a < length; a++) {
		cd = list[a].possible_pairs.user_data.sum;
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

CALC.greatest_weighed = function(list, id) {
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
	return out;
}



exports.CALC = CALC;