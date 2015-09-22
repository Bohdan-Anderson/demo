var app = {
	init: function() {
		if (http) {
			http.init();
		}
		if (socket) {
			socket.startServer(http);
		}
		if (game && socket) {
			game.init(socket.io);
		}
	}
};

var http = require('./server/http').http,
	socket = require('./server/socket').socket,
	game = require('./server/game').game;
app.init();