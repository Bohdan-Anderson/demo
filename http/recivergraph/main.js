var app = {
	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		app.socket.on("reciver", app.reciver);
		app.data = {};

		app.container = d3.select("#list");

		// app.list = $("#list")[0];
	},
	reciver: function(data) {
		if (app.data[data.id]) {
			app.data[data.id].list.push(data);
			if (app.data[data.id].list.length > 10) {
				app.data[data.id].list.shift()
			};

			//UPdate chart

		} else {
			// Create chart
			app.data[data.id] = {
				"list": [data]
			}
			console.log(app.data[data.id])

		}
	}
}
app.init();