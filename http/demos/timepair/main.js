var app = {
	data: {
		"type": "tap demo start pair"
	},

	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		app.socket.on("tap demo paired", app.paired);
		$("#button").click(app.clickButton);
		// app.data.colour = [parseInt(Math.random() * 255), parseInt(Math.random() * 255), parseInt(Math.random() * 255)];
		// $("body").css("background-color", "rgb(" + app.data.colour[0] + "," + app.data.colour[1] + "," + app.data.colour[2] + ")");
	},

	clickButton: function(event) {
		app.data.time = new Date().getTime()
		app.socket.emit("data", app.data)
	},
	paired: function(data) {
		console.log(data);
		alert("paired");
	}
}
app.init();