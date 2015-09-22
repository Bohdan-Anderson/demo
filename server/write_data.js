var fs = require('fs');

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
	});
}
exports.write_data = write_data;