var app = {
	data: {
		type: "zero",
		movingAverage: {
			alpha: 0,
			beta: 0,
			gamma: 0
		},
		zero: {
			alpha: 0,
			gamma: 0,
			beta: 0
		},
		mean: {
			alpha: 0,
			beta: 0,
			gamma: 0
		},
		variation: {
			alpha: 0,
			beta: 0,
			gamma: 0
		},
		stddev: {
			alpha: 0,
			beta: 0,
			gamma: 0
		},
	},
	noSend: {},

	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		app.socket.emit("data", "- Std Dev Called -");
		app.mean();
	},
	mean: function() {

		app.socket.emit("data", "- Mean Called -");

		var arr1 = [];

		arr1[0] = {
			alpha: 600,
			beta: 1,
			gamma: 5
		};
		arr1[1] = {
			alpha: 470,
			beta: 4,
			gamma: 10
		};
		arr1[2] = {
			alpha: 170,
			beta: 8,
			gamma: 25
		};
		arr1[3] = {
			alpha: 430,
			beta: 8,
			gamma: 25
		};
		arr1[4] = {
			alpha: 300,
			beta: 8,
			gamma: 25
		};

		for (var i = 0; i < arr1.length; i++) {
			app.data.mean.alpha += arr1[i].alpha;
			app.data.mean.beta += arr1[i].beta;
			app.data.mean.gamma += arr1[i].gamma;

			//app.socket.emit("data", app.data.mean.alpha + " " + app.data.mean.beta + " " + app.data.mean.gamma);
		}

		app.data.mean = {
			alpha: app.data.mean.alpha / arr1.length,
			beta: app.data.mean.beta / arr1.length,
			gamma: app.data.mean.gamma / arr1.length
		};

		app.variance();
	},
	variance: function() {

		app.socket.emit("data", "- Variance Called -");

		var arr1 = [];

		arr1[0] = {
			alpha: 600,
			beta: 1,
			gamma: 5
		};
		arr1[1] = {
			alpha: 470,
			beta: 4,
			gamma: 10
		};
		arr1[2] = {
			alpha: 170,
			beta: 8,
			gamma: 25
		};
		arr1[3] = {
			alpha: 430,
			beta: 8,
			gamma: 25
		};
		arr1[4] = {
			alpha: 300,
			beta: 8,
			gamma: 25
		};

		for (var i = 0; i < arr1.length; i++) {
			app.data.variation.alpha += ((arr1[i].alpha - app.data.mean.alpha) * (arr1[i].alpha - app.data.mean.alpha));
			app.data.variation.beta += ((arr1[i].beta - app.data.mean.beta) * (arr1[i].beta - app.data.mean.beta));
			app.data.variation.gamma += ((arr1[i].gamma - app.data.mean.gamma) * (arr1[i].gamma - app.data.mean.gamma));
		}
		app.data.variation = {
			alpha: app.data.variation.alpha / arr1.length,
			beta: app.data.variation.beta / arr1.length,
			gamma: app.data.variation.gamma / arr1.length
		};

		app.socket.emit("data", "Variation Exit");

		app.standardDev();
	},
	standardDev: function() {

		app.socket.emit("data", "stddev Called");

		app.data.stddev = {
			alpha: app.data.stddev.alpha = (Math.sqrt(app.data.variation.alpha)),
			beta: app.data.stddev.beta = (Math.sqrt(app.data.variation.beta)),
			gamma: app.data.stddev.gamma = (Math.sqrt(app.data.variation.gamma))
		};

		app.socket.emit("data", app.data.stddev);

		app.socket.emit("data", "stddev exit");
	}
}
app.init();