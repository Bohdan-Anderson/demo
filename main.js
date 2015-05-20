var app = {
	init: function() {
		if (http) {
			http.init();
		}
		if (socket) {
			socket.startServer(http);
		}
	}
};

http = require('./http').http;
socket = require('./socket').socket;

app.init();