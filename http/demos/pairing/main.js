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
	},
	standardDev: function() {

		if (compare == true) {

		for (var i = 0; i < win; i++) {

			carray[i] = {alpha: diff(arr1[i].alpha,arr2[i].alpha), beta: diff(arr1[i].beta,arr2[i].beta), gamma: diff(arr1[i].gamma,arr2[i].gamma)};

			if (win == 5) {
				itstime = true;
			}
		}

		if (itstime == true) {
			var same = variance(carray,mean(carray));

			if (Math.sqrt(same.alpha) <= 5 && Math.sqrt(same.beta) <= 5 && Math.sqrt(same.gamma) <= 15) {
				console.log("PAIRED");
			} else {
				console.log("Not Paired");
			}
		}
	}

		function mean(objArr) {
		var meansA = null, meansB = null, meansG = null, means = {};
		for (var i = 0, l = 5; i !== l; i++) {
  			meansA += objArr[i].alpha;
  			meansB += objArr[i].beta;
  			meansG += objArr[i].gamma;
		}
		means = {alpha: meansA/5, beta: meansB/5, gamma: meansG/5};
		return means;
	}

		function variance(objArr,objAvg) {
		var varyA = null, varyB = null, varyG = null, vary = {};
		for (var i = 0, l = 5; i !== l; i++) {

			//Square the difference value derived from the average
  			varyA += (diff(objArr[i].alpha,objAvg.alpha)*(diff(objArr[i].alpha,objAvg.alpha)));
  			varyB += (diff(objArr[i].beta,objAvg.beta)*(diff(objArr[i].beta,objAvg.beta)));
  			varyG += (diff(objArr[i].gamma,objAvg.gamma)*(diff(objArr[i].gamma,objAvg.gamma)));
		}
			vary = {alpha: varyA/5, beta: varyB/5, gamma: varyG/5};
			return vary
		}
	}
}
app.init();


/*

	var arr1 = {}, arr2 = {}, carray = {};
	var compare = true;
	var win = 5, itstime = false;

	
	//Test case 1
	arr1[0] = {alpha: 600, beta: 1, gamma: 5};
	arr1[1] = {alpha: 470, beta: 4, gamma: 10};
	arr1[2] = {alpha: 170, beta: 8, gamma: 25};
	arr1[3] = {alpha: 430, beta: 8, gamma: 25};
	arr1[4] = {alpha: 300, beta: 8, gamma: 25};


	arr2[0] = {alpha: 600, beta: 1, gamma: 5};
	arr2[1] = {alpha: 470, beta: 4, gamma: 10};
	arr2[2] = {alpha: 170, beta: 8, gamma: 25};
	arr2[3] = {alpha: 430, beta: 8, gamma: 25};
	arr2[4] = {alpha: 300, beta: 8, gamma: 25};
	
	//test case 2 : Find difference value then compute std deviation. The benefits are speed and flexibility, but accuaracy might take a hit. Need to test.
	arr1[0] = {alpha: 600, beta: 2, gamma: 5};
	arr1[1] = {alpha: 470, beta: 4, gamma: 10};
	arr1[2] = {alpha: 170, beta: 8, gamma: 25};
	arr1[3] = {alpha: 430, beta: 8, gamma: 50};
	arr1[4] = {alpha: 300, beta: 8, gamma: 25};

	arr2[0] = {alpha: 190, beta: 1, gamma: 5};
	arr2[1] = {alpha: 460, beta: 7, gamma: 10};
	arr2[2] = {alpha: 170, beta: 6, gamma: 25};
	arr2[3] = {alpha: 430, beta: 6, gamma: 20};
	arr2[4] = {alpha: 295, beta: 6, gamma: 30};

	if (compare == true) {

		for (var i = 0; i < win; i++) {

			carray[i] = {alpha: diff(arr1[i].alpha,arr2[i].alpha), beta: diff(arr1[i].beta,arr2[i].beta), gamma: diff(arr1[i].gamma,arr2[i].gamma)};

			if (win == 5) {
				itstime = true;
			}
		}

		if (itstime == true) {
			var same = variance(carray,mean(carray));

			if (Math.sqrt(same.alpha) <= 5 && Math.sqrt(same.beta) <= 5 && Math.sqrt(same.gamma) <= 15) {
				console.log("PAIRED");
			} else {
				console.log("Not Paired");
			}
		}
	}

	//Finds the mean average of all values for each dimension in the array
	
	function mean(objArr) {
		var meansA = null, meansB = null, meansG = null, means = {};
		for (var i = 0, l = 5; i !== l; i++) {
  			meansA += objArr[i].alpha;
  			meansB += objArr[i].beta;
  			meansG += objArr[i].gamma;
		}
		means = {alpha: meansA/5, beta: meansB/5, gamma: meansG/5};
		return means;
	}

	function stddev() {
		//this might not be needed at all since it's just the sqrt of stuff. I can probably consolidate all of this stuff into a faster more localized function.
	}

	function variance(objArr,objAvg) {
		var varyA = null, varyB = null, varyG = null, vary = {};
		for (var i = 0, l = 5; i !== l; i++) {
  			varyA += (diff(objArr[i].alpha,objAvg.alpha)*(diff(objArr[i].alpha,objAvg.alpha)));
  			varyB += (diff(objArr[i].beta,objAvg.beta)*(diff(objArr[i].beta,objAvg.beta)));
  			varyG += (diff(objArr[i].gamma,objAvg.gamma)*(diff(objArr[i].gamma,objAvg.gamma)));
		}
		vary = {alpha: varyA/5, beta: varyB/5, gamma: varyG/5};
		return vary
	}

	function diff(val1, val2) {
		return val1 - val2;
	}

*/