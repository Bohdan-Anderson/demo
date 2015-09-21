var APP = {
	init: function() {
		GAME.init();
	},
	pr: function(message) {
		$("#jsmessage")[0].innerHTML = message;
	},
	print_data: function(data) {
		if (typeof(data) !== "object" && !data.length) {
			console.log(data);
			return false;
		}
		if (!data.length) {
			console.log("\n\n");
			for (var key in data) {
				console.log(key);
				console.log(data[key]);
			}
			console.log("\n\n");
			return false;
		}
		for (var i = data.length - 1; i >= 0; i--) {
			console.log(data[i]);
		};
	}
}