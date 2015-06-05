var app = {
	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		app.socket.on("reciver", app.reciver);
		app.list = $("#list")[0];
	},
	reciver: function(data) {
		var li = $("#" + data.id);
		if (data.type == "disconnect" && li[0]) {
			li = li[0];
			li.parentNode.removeChild(li);
			return false;
		}
		if (li.length > 0) {
			app.list.appendChild(app.format(data, li[0]));

		} else {
			app.list.appendChild(app.format(data));
		}
	},
	format: function(data, liElement) {
		if (liElement) {
			app.list.removeChild(liElement);
		}
		var li = document.createElement("li");

		li.id = data.id;

		for (var el in data) {
			var temp = document.createElement("span");
			temp.innerHTML = el + ": " + data[el];
			li.appendChild(temp);
		}

		return li
	}
}
app.init();