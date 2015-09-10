var http = {

	init: function() {
		console.log("http starting")
		http.connect = require('connect');
		http.staticServer = require('serve-static');
		http.http = require('http');

		http.app = http.connect().use(http.staticServer(__dirname + "/../http"));
		http.server = http.http.createServer(http.app);
	},
	start: function() {
		// http.server.listen(80, "158.69.10.32");
		http.server.listen(8000); //local
		console.log("http server starting on port 8000")
	}
}

exports.http = http;