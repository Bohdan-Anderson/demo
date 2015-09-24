var fs = require('fs');
var socket_object = require('./socket_object').SOCKET_OBJECT;

var game = {
	io: null,
	init: function(socket) {
		game.io = socket;
		time.init();
	}
}

var time = {
	point: [], // data is store in there [[time,socket],[time,socket],[time,socket]]
	time_size: 1500,
	checker_interval: 100,
	init: function() {
		game.io.sockets.on('connection', time.connect);
		// the checker make a function that loops through the time.point
		// if the element don't have the same socket id it pairs them.
		// if the element has the same socket id, it removes it and adds an updated object
		time.checker.init();
	},
	// when we get data of a certain type we test for pairs
	// we test against the time.point array
	connect: function(socket) {


		socket.on('join queue', function(data) {
			console.log("\t\t" + socket.id + " joined queue")
			socket.emit("joined queue", time.time_size);
			socket.has_been_sent_win_message = false; // don't win multiple times
			socket.messaged_to_continue = false; // don't send multiple pairing possibilities
			socket.weights = {};
			socket.possible_pairs = socket_object(socket);

			if (time.point.length) {
				for (var a = 0, max = time.point.length; a < max; ++a) {
					if (time.point[a][1]["id"] != socket["id"]) {
						socket.possible_pairs.pairs.push(time.point[a][1]);
						if (!time.point[a][1].messaged_to_continue) {
							time.point[a][1].emit("continue to record", socket.id);
							time.point[a][1].messaged_to_continue = true;
						}
						if (!socket.messaged_to_continue) {
							socket.emit("continue to record", "continue");
						}
					} else {
						time.point.splice(a, 1);
						a -= 1;
						max -= 1;
					}
				}
				// socket.possible_pairs.message_pairs("time paired 3", "worked!");
			}
			time.point.push([new Date().getTime(), socket]);
		});

		socket.on('recording finished', function(data) {
			console.log("\t" + socket.id + " sent final data");
			socket.possible_pairs.user_data = data;
			socket.possible_pairs.check(game.io);
		});
	},

	checker: {
		looptarget: null,
		init: function() {
			time.checker.looptarget = setInterval(time.checker.loop, time.checker_interval);
		},
		loop: function() {
			var t = new Date().getTime();
			for (var i = time.point.length - 1; i >= 0; i--) {
				// console.log("\t\t" + time.point[i][0])
				if (time.point[i][0] + time.time_size < t) {
					console.log("\t\t" + time.point[i][1].id + " left queue")
					time.point.splice(i, 1);
					i -= 1;
				}
			};
		}
	}
}







exports.game = game;