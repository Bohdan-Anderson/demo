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
		setInterval(app.beat, 500);
		app.target= $("#datafeed")
		app.rotateThis = $("#transformtarget")
		$("#wrapper").click(app.makeZero);
	},

	beat: function(event) {
		app.socket.emit("data", app.data);
	},
	rotate: function(ammount){
		app.rotateThis.css({
			"-ms-transform":"rotate("+ammount+"deg)",
			"-webkit-transform":"rotate("+ammount+"deg)",
			"transform":"rotate("+ammount+"deg)"
		})
	},
	makeZero: function(){
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
		app.data.raw = (event.alpha-180)/90;
		app.data.rotation = Math.sin(app.data.raw - app.data.zero);
		app.rotate(app.data.rotation*90);
		app.target.html(app.data.rotation.toFixed(1));
	}
}
app.init();