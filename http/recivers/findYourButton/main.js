var app = {
	v: {
		freq: 100,
		fade: 500,
		count: 10
	},

	init: function() {
		app.socket = io.connect(SETTINGS.ip);
		app.socket.on("reciver", app.reciver);
		app.nav.init();

		// parent list of all elements
		app.l = $("#list");
		// list of all elements
		app.ci = $(".button");
		app.ca = $(".button-auto");

		app.but.init();

		app.beat = setInterval(app.highlightRandom, app.v.freq);
	},

	highlightRandom: function() {
		var selection = parseInt(Math.floor(Math.random() * app.ca.length));
		selection = $(app.ca[selection]);
		if (selection.hasClass("highlight")) {
			return false;
		}
		selection.addClass("highlight");
		setTimeout(function() {
			selection.removeClass("highlight");
		}, app.v.fade)
	},

	but: {
		init: function() {
			for (var a = 0; a < app.v.count; ++a) {
				app.but.create({
					id: a,
					colour: [parseInt(Math.random() * 255), parseInt(Math.random() * 255), parseInt(Math.random() * 255)],
					type: "button-auto"
				});
			}
		},
		edit: function(data, el) {
			var selection = el;
			if (selection.hasClass("highlight")) {
				return false;
			}
			selection.addClass("highlight");
			setTimeout(function() {
				selection.removeClass("highlight");
			}, app.v.fade)
		},
		create: function(data) {
			if (data.type != "button" && data.type != "button-auto") {
				return false;
			}
			var el = $(document.createElement('li'))
			el[0].id = data.id;
			el.addClass(data.type)
			if (app.ca.length) {
				// we make a selection to randomly place the selection
				var selection = $(app.ca[parseInt(Math.floor(Math.random() * app.ca.length))]);
				selection.after(el);
			} else {
				app.l.append(el);
			}
			el.css("background-color", "rgb(" + data.colour[0] + "," + data.colour[1] + "," + data.colour[2] + ")");

			app.c = $(".button");
			app.ca = $(".button-auto");
		},
		update: function(data) {
			//we either create or edit
			if (app.but.edit(data) == false) {
				app.but.create(data);
			}
		}
	},


	nav: {
		init: function() {
			console.log("nav init")
			$("#grey").click(app.nav.grey);
			// $("#countchange").val(app.v.count)
			$("#countchange").change(app.nav.countchange);
			$("#freqchange").change(app.nav.freqchange);
			$("#fadechange").change(app.nav.fadechange);
			app.hash.init();
			$("#countchange").val(app.v.count)
			$("#freqchange").val(app.v.freq)
			$("#fadechange").val(app.v.fade)
		},
		grey: function(event) {
			event.preventDefault();
			console.log("grey")
			$("body").toggleClass("grey");
			return false;
		},
		countchange: function() {
			if (this.value > app.ca.length) {
				for (var a = app.ca.length; a < this.value; ++a) {
					app.but.create({
						id: a,
						colour: [parseInt(Math.random() * 255), parseInt(Math.random() * 255), parseInt(Math.random() * 255)],
						type: "button-auto"
					});
				}
			} else if (this.value < app.ca.length) {
				for (var a = app.ca.length; a > this.value; --a) {
					$("#" + (a - 1)).remove();
				}
				app.ca = $(".button-auto");
			}
			app.v.count = app.ca.length;
			app.hash.update();
		},
		freqchange: function() {
			app.v.freq = this.value;
			clearInterval(app.beat)
			app.beat = setInterval(app.highlightRandom, app.v.freq);
			app.hash.update();
		},
		fadechange: function() {
			app.v.fade = this.value;
			app.hash.update();
		}
	},
	hash: {
		init: function() {
			var h = window.location.hash.split("#").pop().split("&");
			for (var a = 0; a < h.length; ++a) {
				var c = h[a].split("=")
				app.v[c[0]] = parseInt(c[1])
			}
		},
		update: function() {
			var out = "";
			for (el in app.v) {
				if (app.v[el]) {
					if (out.length) {
						out += "&";
					}
					out += el + "=" + app.v[el];
				}
			}
			window.location.hash = out;
		}
	},
	reciver: function(data) {
		var li = $("#" + data.id);
		if (data.type == "disconnect") {
			li.remove();
			return false;
		}
		if (!li.length) {
			app.but.create(data);
		} else {
			app.but.edit(data, li);
		}
	}
}
app.init();