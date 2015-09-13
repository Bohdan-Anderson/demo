var app = {

	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		$(".button").click(app.clickButton);
	},

	clickButton: function(event) {
		var t = new Date().getTime()
		var out = {
			"time": t,
			"type": this.id
		};
		app.socket.emit("moc_pair", out);
	}
}
app.init();