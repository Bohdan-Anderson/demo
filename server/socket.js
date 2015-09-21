var websocket = {
	socketCodes: {},
	tcp: null,
	io: null,
	startServer: function(httpserver) {
		websocket.io = require('socket.io')(httpserver.server);
		httpserver.start();
		websocket.views.init();
	},
	views: {
		init: function() {
			websocket.io.sockets.on('connection', function(socket) {
				console.log("connection");
				console.log("connected " + socket.id);
				socket.on('data', function(data) {
					data.id = socket.id;
					//console.log(data["type"]); // Bohdan!!!!!!!!!!!!!
					console.log(data); //NEW TEMP Remove later
					websocket.io.emit("reciver", data);
				});

				socket.on("disconnect", function(data) {
					console.log("disconnect " + socket.id);
					websocket.io.emit("reciver", {
						type: "disconnect",
						id: socket.id
					})
				});

				socket.on("moc_pair", function(data) {
					// console.log("moc_pair " + data.type);
					data.id = socket.id;
					websocket.io.emit("reciver", data);
					websocket.io.emit(("pairing_" + data.type), data)
				});
			});
		}
	},
}

exports.socket = websocket;