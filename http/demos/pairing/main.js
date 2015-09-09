var app = {
	data: {
		"type": "button"
	},

	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		$("#button").click(app.clickButton);
		app.data.colour = [parseInt(Math.random() * 255), parseInt(Math.random() * 255), parseInt(Math.random() * 255)];
		$("body").css("background-color", "rgb(" + app.data.colour[0] + "," + app.data.colour[1] + "," + app.data.colour[2] + ")");
	},

	clickButton: function(event) {
		app.data.time = new Date().getTime()
		app.socket.emit("data", app.data)
	}
}
app.init();