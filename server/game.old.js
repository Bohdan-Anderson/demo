var game = {
	io: null,
	init: function(socket) {
		game.io = socket;
		time.init();
	}
}







var time = {
	point: [], // data is store in there [[time,socket],[time,socket],[time,socket]]
	time_size: 250,
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
		socket.on('data', function(data) {
			if (data.type == "tap demo start pair") {
				for (var a = 0, max = time.point.length; a < max; ++a) {
					if (time.point[a][1]["id"] != socket["id"]) {
						socket.emit("tap demo paired", data);
						time.point[0][1].emit("tap demo paired", data)
						time.point.splice(a, 1);
						a -= 1;
						max -= 1;
						return false;
					} else {
						time.point.splice(a, 1);
						a -= 1;
						max -= 1;
					}
				}
				time.point.push([new Date().getTime(), socket])
			}
		});
	},

	checker: {
		looptarget: null,
		init: function() {
			time.checker.looptarget = setInterval(time.checker.loop, time.checker_interval);
		},
		loop: function() {
			var t = new Date().getTime();
			console.log("\n\n")
			console.log("start time: \t" + t);
			for (var i = time.point.length - 1; i >= 0; i--) {
				console.log("\t\t" + time.point[i][0])
				if (time.point[i][0] + time.time_size < t) {
					time.point.splice(i, 1);
					i -= 1;
				}
			};
		}
	}
}

exports.game = game;