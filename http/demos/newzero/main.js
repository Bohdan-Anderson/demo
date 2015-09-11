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
		userArr: [],
		count: 0,
	},
	noSend: {

	},

	init: function() {
		console.log("starting");
		app.socket = io.connect(SETTINGS.ip);
		setInterval(app.beat, 500);
		window.addEventListener('deviceorientation', app.onOrientaionEvent, true);
		app.target = $("#datafeed")
		$("#wrapper").click(app.makeZero);
	},
	beat: function(event) {
		app.measure();
		//app.socket.emit("data", app.data.userArr);
	},
	makeZero: function() {

		app.socket.emit("data", "- ZEROED -");

		app.data.zero = {}

		app.data.zero.alpha = app.data.alpha;
		app.data.zero.beta = app.data.beta;
		app.data.zero.gamma = app.data.gamma;

		app.measure();

		/*
		app.socket.emit("data", "Deg Alpha: "+app.data.alpha+" = Units: "+(Math.sin(radAlpha)));
		app.socket.emit("data", "Deg Beta: "+(app.mapRange(app.data.beta,-180,180,0,360))+" = Units: "+(Math.sin(radBeta)));
		app.socket.emit("data", "Deg Gamma: "+(app.mapRange(app.data.gamma,-90,90,0,360))+" = Units: "+(Math.sin(radGamma)));
		*/
	},
	mapRange: function(val, l1, h1, l2, h2) {
		return l2 + (h2 - l2) * (val - l1) / (h1 - l1);
	},
	measure: function() {
		//Let's do some math

		//This sets up for SIN

		radAlpha = (Math.PI / 180) * app.data.alpha; //alpha: [0,360]
		radAlphaZ = (Math.PI / 180) * (app.data.zero.alpha - app.data.alpha); //alpha: [0,360]

		radBeta = (Math.PI / 180) * (app.mapRange(app.data.beta, -180, 180, 0, 360)); //beta: [-180,180]
		radBetaZ = (Math.PI / 180) * (app.data.zero.beta - (app.mapRange(app.data.beta, -180, 180, 0, 360))); //beta: [-180,180]

		radGamma = (Math.PI / 180) * (app.mapRange(app.data.gamma, -90, 90, 0, 360)); //gamma: [-90,90]
		radGammaZ = (Math.PI / 180) * (app.data.zero.gamma - (app.mapRange(app.data.gamma, -90, 90, 0, 360))); //gamma: [-90,90]

		app.data.alphaCurve = (Math.sin(radAlpha));
		app.data.betaCurve = (Math.sin(radBeta));
		app.data.gammaCurve = (Math.sin(radGamma));

		app.data.count = app.data.count += 1;

		if (app.data.count < 16) {
			app.data.userArr[app.data.count] = {
				alpha: Math.sin(radAlphaZ),
				beta: Math.sin(radBetaZ),
				gamma: Math.sin(radGammaZ)
			};

		} else {
			app.data.count = 0;
			app.socket.emit("data", app.data.userArr);
		}

		//app.socket.emit("data", app.data.userArr);

		//app.socket.emit("data", Math.sin(radAlphaZ));

		/*
		app.data.movingAverage.alpha = (Math.abs(app.data.zeros.alpha-app.data.alpha) * 0.4) + (app.data.movingAverage.alpha * (1 - 0.4));
		app.data.movingAverage.beta = (Math.abs(app.data.zeros.beta-app.data.beta) * 0.4) + (app.data.movingAverage.beta * (1 - 0.4));
		app.data.movingAverage.gamma = (Math.abs(app.data.zeros.gamma-app.data.gamma) * 0.4) + (app.data.movingAverage.gamma * (1 - 0.4));
		*/

		//app.socket.emit("data", "Moving: "+app.data.movingAverage.alpha+" : "+app.data.movingAverage.beta+" : "+app.data.movingAverage.gamma);
	},
	onOrientaionEvent: function(event) {
		//A little bit better but it needs more filtering and smoothing.
		//app.data.alpha = app.data.movingAverage.alpha = (event.alpha * 0.6) + (app.data.movingAverage.alpha * (1 - 0.6));
		app.data.alpha = event.alpha;
		app.data.beta = event.beta;
		app.data.gamma = event.gamma;

		//app.socket.emit("data", app.data.alpha);
	}
}
app.init();