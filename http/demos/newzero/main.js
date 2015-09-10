var app = {

	data: {
		type: "zero",
		zero: 0
	},

	deviceorientation_previous: new Date(),

	init: function() {
		console.log("starting");
		app.socket = io.connect(SETTINGS.ip);
		window.addEventListener("deviceorientation", app.onOrientaionEvent, true);
		//setInterval(app.beat, 500);
		app.target= $("#datafeed")
		// app.rotateThis = $("#transformtarget")
		$("#wrapper").click(app.makeZero);
	},

	beat: function(event) {
		app.socket.emit("data", app.data);
	},
	rotate: function(ammount){

	},
	makeZero: function(){
		zeroin = true;

		//This value gets set when zeroed

		timing = Date.now();

		zeroAlpha = Math.abs(Math.floor(alpha - 180));
		zeroBeta = Math.abs(Math.floor(beta));
		zeroGamma = Math.abs(Math.floor(gamma));

		console.log(zeroBeta);

    	if (zeroin == true) {
    		console.log("time: "+timing);
			
			//Another way to improve accuracy would be to take into account the timing that each user presses zero

			var alphaDyn1 = Math.abs(Math.floor(alpha - 180));
			var betaDyn1 = Math.abs(Math.floor(beta));
			var gammaDyn1 = Math.abs(Math.floor(gamma));

			// mvgAvg1a = (Math.abs(zeroAlpha1-alphaDyn1) * 0.4) + (mvgAvg1a * (1 - 0.4));
			// mvgAvg2a = (Math.abs(zeroAlpha2-alphaDyn2) * 0.4) + (mvgAvg2a * (1 - 0.4));

			// mvgAvg1b = (Math.abs(zeroBeta1-betaDyn1) * 0.4) + (mvgAvg1b * (1 - 0.4));
			// mvgAvg2b = (Math.abs(zeroBeta2-betaDyn2) * 0.4) + (mvgAvg2b * (1 - 0.4));

			// mvgAvg1g = (Math.abs(zeroGamma1-gammaDyn1) * 0.4) + (mvgAvg1g * (1 - 0.4));
			// mvgAvg2g = (Math.abs(zeroGamma2-gammaDyn2) * 0.4) + (mvgAvg2g * (1 - 0.4));

			// console.log("Moving Avg1 A: "+(Math.floor(mvgAvg1a)));
			// console.log("Moving Avg1 B: "+(Math.floor(mvgAvg1b)));
			// console.log("Moving Avg1 G: "+(Math.floor(mvgAvg1g)));
    	}
	},
	onOrientaionEvent: function(event) {
		gamma = event.gamma;
		beta = event.beta;
		alpha = event.alpha;
	}
}
app.init();