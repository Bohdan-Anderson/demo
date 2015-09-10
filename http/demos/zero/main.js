var app = {

	data: {
		type: "zero",
		zero: 0
	},
	// deviceorientation_previous: new Date(),

	init: function() {
		console.log("starting");
		app.socket = io.connect(SETTINGS.ip);
		// window.addEventListener("deviceorientation", app.onOrientaionEvent, true);
		// setInterval(app.beat, 500);
		app.target = $("#datafeed")
		app.rotateThis = $("#transformtarget")
		$("#wrapper").click(app.makeZero);
		app.gn = new GyroNorm();

		var args = {
			frequency: 50, // ( How often the object sends the values - milliseconds )
			gravityNormalized: true, // ( If the garvity related values to be normalized )
			orientationBase: GyroNorm.GAME, // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
			decimalCount: 2, // ( How many digits after the decimal point will there be in the return values )
			logger: null, // ( Function to be called to log messages from gyronorm.js )
			screenAdjusted: false // ( If set to true it will return screen adjusted values. )
		};
		app.gn.init(args).then(app.gninit);
	},

	gninit: function() {
		app.gn.start(function(data) {


			// beta is [-90 to 90] and is 

			var y = data.do.gamma
			var x = data.do.beta
			var z = data.do.alpha

			// var xs = Math.sin(x / 90).toFixed(1)
			// var ys = Math.sin(y / 90).toFixed(1)

			// app.target.html(xs + " <br> " + ys);
			var xr = (x / 90);
			if (xr > 1) {
				xr -= 1;
			} else if (xr < -1) {
				xr += 1;
			}
			app.target.html(xr.toFixed(2))

			// app.target.html(Math.sin(y / 90).toFixed(1))

			// app.target.html(data.do.alpha + " <br> " + data.do.beta + " <br> " + data.do.gamma + " <br> " + parseInt(data.do.alpha + data.do.beta + data.do.gamma));

			// app.data.raw = (data.do.alpha - 180) / 180;
			// app.data.rotation = Math.sin(app.data.raw - app.data.zero);
			// app.rotate(app.data.rotation * 45);
			// app.target.html(app.data.rotation.toFixed(1));



			// app.target.html(app.data.raw);

			// app.target.html(data.do.alpha + " " + data.do.beta + " " + data.do.gamma);
			// Process:
			// data.do.alpha    ( deviceorientation event alpha value )
			// data.do.beta     ( deviceorientation event beta value )
			// data.do.gamma    ( deviceorientation event gamma value )
			// data.do.absolute ( deviceorientation event absolute value )

			// data.dm.x        ( devicemotion event acceleration x value )
			// data.dm.y        ( devicemotion event acceleration y value )
			// data.dm.z        ( devicemotion event acceleration z value )

			// data.dm.gx       ( devicemotion event accelerationIncludingGravity x value )
			// data.dm.gy       ( devicemotion event accelerationIncludingGravity y value )
			// data.dm.gz       ( devicemotion event accelerationIncludingGravity z value )

			// data.dm.alpha    ( devicemotion event rotationRate alpha value )
			// data.dm.beta     ( devicemotion event rotationRate beta value )
			// data.dm.gamma    ( devicemotion event rotationRate gamma value )
		});
	},

	beat: function(event) {
		app.socket.emit("data ", app.data);
	},
	rotate: function(ammount) {
		app.rotateThis.css({
			" - ms - transform ": "rotate(" + ammount + "deg)",
			" - webkit - transform ": "rotate(" + ammount + "deg)",
			"transform ": "rotate(" + ammount + "deg)"
		})
	},
	makeZero: function() {
		app.data.zero = app.data.raw;
	},

	onOrientaionEvent: function(event) {
		var now = new Date();
		if (now - app.deviceorientation_previous < 10) {
			return false;
		}
		app.deviceorientation_previous = now;

		//we do some math so that we never get a jump from pos to neg or w.e. we use sin!
		//initial range is 0 to 360, we convert it to -1 to 1 and 0 being when the phone is sideways
		//however with this form we loose which direction the phone is rotating... kinda

		app.data.raw = parseInt(event.alpha) + " " + parseInt(event.beta) + " " + parseInt(event.gamma) //(event.alpha - 180) / 180;
		// app.data.rotation = Math.sin(app.data.raw - app.data.zero);
		// app.rotate(app.data.rotation*90);
		// app.target.html(app.data.rotation.toFixed(1));
		app.target.html(app.data.raw);
	}
}
app.init();