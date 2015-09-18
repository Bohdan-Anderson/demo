var APP = {
	init: function() {
		GAME.init();
	},
	pr: function(message) {
		$("#jsmessage")[0].innerHTML = message;
	}
}