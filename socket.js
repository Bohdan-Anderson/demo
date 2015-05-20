var websocket = {
	socketCodes: {},
	tcp: null,
	startServer: function(httpserver) {
		websocket.io = require('socket.io')(httpserver.server);
		httpserver.start();
		websocket.views.init();
	},
	views: {
		init: function() {
			websocket.io.sockets.on('connection', function(socket) {

				var re = new RegExp("id=");
				console.log(socket.handshake.headers.cookie)
				if (!re.test(socket.handshake.headers.cookie)) {
					console.log("initial Connect");
					socket.emit('setId', {
						cookie: socket.id
					});
				} else {
					console.log("reconnect");
					var id = socket.handshake.headers.cookie.match(/id=([a-z A-Z 0-9 \-\_]*)/);
					console.log(id[1]);
					if (id === null) {
						id = socket.handshake.headers.cookie.match(/id=(.*)/);
					}
					socket.id = id[1];
				}

				socket.on('data', function(data) {
					// console.log("\n\n");
					data.id = socket.id;
					console.log(data);

					websocket.io.emit("reciver", data);
				})
			});
		}
	},
}

exports.socket = websocket;