var CALC = {
	af: 0,
	bf: 0,
	gf: 0
};





CALC.zero_data = function(points, zero_data) {
	var a = (Math.PI / 180) * (zero_data[0] - points[0]), //alpha: [0,360]
		b = (Math.PI / 180) * (zero_data[1] - CALC.zero_data_map(points[1], -180, 180, 0, 360)), //beta: [-180,180]
		g = (Math.PI / 180) * (zero_data[2] - CALC.zero_data_map(points[2], -90, 90, 0, 360)); //gamma: [-90,90]

	CALC.af = (a * 0.09) + (CALC.af * (1 - 0.09));
	CALC.bf = (b * 0.09) + (CALC.bf * (1 - 0.09));
	CALC.gf = (g * 0.09) + (CALC.gf * (1 - 0.09));

	return [Math.sin(CALC.af), Math.sin(CALC.bf), Math.sin(CALC.gf)];
}
CALC.zero_data_map = function(val, l1, h1, l2, h2) {
	return l2 + (h2 - l2) * (val - l1) / (h1 - l1);
};


CALC.standard_deviation = function(data_in) {
	if (typeof(data_in) !== "object" && !data_in.length) {
		alert("a non array was passed into CALC.standard_deviation");
		return false;
	}
	var out = {
			"standard_deviation_mean": [0, 0, 0],
			"standard_deviation": [0, 0, 0]
		},
		length = data_in.length;

	// mean
	for (var i = 0; i < length; i++) {
		out.standard_deviation_mean[0] += data_in[i][0];
		out.standard_deviation_mean[1] += data_in[i][1];
		out.standard_deviation_mean[2] += data_in[i][2];
	}
	out.standard_deviation_mean[0] = out.standard_deviation_mean[0] / length;
	out.standard_deviation_mean[1] = out.standard_deviation_mean[1] / length;
	out.standard_deviation_mean[2] = out.standard_deviation_mean[2] / length;

	// varience
	for (var i = 0; i < length; i++) {
		out.standard_deviation[0] += Math.pow((data_in[i][0] - out.standard_deviation_mean[0]), 2);
		out.standard_deviation[1] += Math.pow((data_in[i][1] - out.standard_deviation_mean[1]), 2);
		out.standard_deviation[2] += Math.pow((data_in[i][2] - out.standard_deviation_mean[2]), 2);
	}
	out.standard_deviation[0] = out.standard_deviation[0] / length
	out.standard_deviation[1] = out.standard_deviation[1] / length
	out.standard_deviation[2] = out.standard_deviation[2] / length

	return out
}

CALC.slope_aggresion = function(data_in) {
	if (typeof(data_in) !== "object" && !data_in.length) {
		alert("a non array was passed into CALC.slope_aggresion");
		return false;
	}
	var out = [0, 0, 0],
		length = data_in.length - 1;

	for (var a = 0, max = length; a < max; ++a) {
		out[0] += Math.abs(data_in[a][0] - data_in[a + 1][0]);
		out[1] += Math.abs(data_in[a][1] - data_in[a + 1][1]);
		out[2] += Math.abs(data_in[a][2] - data_in[a + 1][2]);
	}

	out[0] = out[0] / length
	out[1] = out[1] / length
	out[2] = out[2] / length

	return out;
}


CALC.sum = function(data_in) {
	if (typeof(data_in) !== "object" && !data_in.length) {
		alert("a non array was passed into CALC.sum");
		return false;
	}
	var out = [0, 0, 0],
		length = data_in.length - 1;
	for (var a = 0, max = length; a < max; ++a) {
		out[0] += Math.abs(data_in[a][0]);
		out[1] += Math.abs(data_in[a][1]);
		out[2] += Math.abs(data_in[a][2]);
	}

	return out
}