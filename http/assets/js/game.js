var GAME = {
	fullscreen: false,
	init: function() {

		if (Cookies.get('element')) {
			GAME.phase3.init();
		} else {
			GAME.phase1.init();
		}

	}
}

// PREAMBLE
GAME.phase1 = {
	first: true,
	init: function() {
		$(document.body).removeClass().addClass("phase1");
		if (GAME.phase1.first) {
			$("#user_to_phase2").click(GAME.phase1.next_phase);
			GAME.phase1.first = false;
		}
	},
	next_phase: function(event) {
		event.preventDefault();
		if (APP.fullscreen && screenfull.enabled) {
			screenfull.request();
		}
		if (screenfull.enabled && GAME.fullscreen == true) {
			screenfull.request();
		}
		GAME.phase2.init();
		return false;
	}
}

// Element Type
GAME.phase2 = {
	first: true,
	init: function() {
		$(document.body).removeClass().addClass("phase2");
		if (GAME.phase2.first) {
			GAME.phase2.first = false;
			$("#user_choose_type a").click(GAME.phase2.set_type);
		}
	},
	set_type: function(event) {
		event.preventDefault();
		Cookies.set('element', this.href.split("#").pop());
		GAME.phase2.next_phase(event);
		return false;
	},
	next_phase: function(event) {
		event.preventDefault();
		GAME.phase3.init();
		return false;
	}
}

// The first step in pairing!
GAME.phase3 = {
	init: function(error) {
		PAIR.D.element = Cookies.get('element');
		PAIR.init();
		if (!PAIR.D.element) {
			GAME.phase2.init();
			return false;
		}
		if (!error) {
			error = "";
		}
		APP.pr(error);
		$(document.body).removeClass().addClass("phase3 " + error);
		//Start the pairing process
	}
}





GAME.phase4 = {
	init: function() {
		$(document.body).removeClass().addClass("phase4 ");
	}
}

GAME.phase5 = {
	first: true,
	init: function(elements) {
		$(document.body).removeClass().addClass("phase5 ");
		console.log(elements);
		$("#pairing_success").html(elements);
		if (GAME.phase5.first) {
			GAME.phase5.first = false;
			$("#paired_keep_playing").click(GAME.phase5.keep_playing);
		}
	},
	keep_playing: function(event) {
		event.preventDefault();
		GAME.phase3.init();
		return false;
	}
}