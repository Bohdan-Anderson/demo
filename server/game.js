var game = {
	io: null,
	init: function(socket) {
		game.io = socket;
		time.init();
	}
}

var time = {
	point: [],
	size: 500,
	init: function() {
		game.io.sockets.on('connection', time.connect);
		time.checker.init();
	},
	connect: function(socket) {
		socket.on('data', function(data) {
			if (data.type == "tap demo start pair") {
				for (var a = 0, max = time.point.length; a < max; ++a) {
					if (time.point[a][1]["id"] != socket["id"]) {
						socket.emit("tap demo paired", data);
						time.point[0][1].emit("tap demo paired", data)
						//we could remove the old data point here but it doens't really matter
						return false;
					}
				}
				time.point.push([new Date().getTime(), socket])
			}
		});
	},
	checker: {
		looptarget: null,
		init: function() {
			time.checker.looptarget = setInterval(time.checker.loop, 100);
		},
		loop: function() {
			var t = new Date().getTime();
			// console.log("\n\n")
			// console.log("start time: \t" + t);
			for (var i = time.point.length - 1; i >= 0; i--) {
				// console.log("\t\t" + time.point[i][0])
				if (time.point[i][0] + time.size < t) {
					time.point.splice(i, 1);
					i -= 1;
				}
			};
		}
	}
}

exports.game = game;