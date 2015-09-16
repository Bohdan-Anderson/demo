app.game = {
	fullscreen: false,
	init: function() {

		if (Cookies.get('type')) {
			app.game.phase3.init();
		} else {
			app.game.phase1.init();
		}

	}
}

app.game.phase1 = {
	init: function() {
		$(document.body).removeClass().addClass("phase1");
		$("#user_to_phase2").click(app.game.phase1.next_phase);
	},
	next_phase: function(event) {
		event.preventDefault();
		if (screenfull.enabled && app.game.fullscreen == true) {
			screenfull.request();
		}
		$(document.body).removeClass("phase1").addClass("phase2");
		app.game.phase2.init();
		return false;
	}
}


app.game.phase2 = {
	init: function() {
		$(document.body).removeClass().addClass("phase2");
		$("#user_choose_type a").click(app.game.phase2.set_type);
	},
	set_type: function(event) {
		event.preventDefault();
		console.log(this.href.split("#").pop())
		Cookies.set('type', this.href.split("#").pop());
		app.game.phase2.next_phase(event);
		return false;
	},
	next_phase: function(event) {
		event.preventDefault();
		$(document.body).removeClass("phase2").addClass("phase3");
		app.game.phase3.init();
		return false;
	}
}

app.game.phase3 = {
	init: function(error) {
		app.data.element = Cookies.get('type');
		if (!app.data.element) {
			app.game.phase2.init();
			return false;
		}
		if (!error) {
			error = "";
		}
		$(document.body).removeClass().addClass("phase3 " + error);
		if (!app.socket) {
			app.socket = io.connect(SETTINGS.ip);
			app.socket.on("wait 2", app.wait);
			app.socket.on("time paired 3", app.found_potential_pair);
			app.socket.on("quarter check 5", app.quart_check);
			app.socket.on("final check 7", app.final_check);
			$("#pairing_button").click(app.clickButton);
		}
	}
}





app.game.phase4 = {
	init: function() {
		$(document.body).removeClass().addClass("phase4 ");
	}
}