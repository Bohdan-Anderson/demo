var game = {
	io: null,
	init: function(socket) {
		game.io = socket;
		time.init();
	}
}

var time = {
	init: function() {
		game.io.sockets.on('connection', time.connect);
	},
	connect: function(socket) {
		socket.on('data', time.listen_for.data);
	},
	listen_for: {
		data: function(data) {
			console.log(data["type"]);
		}
	}
}

exports.game = game;