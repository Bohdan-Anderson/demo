var UNITY = {}


// > type 1
// > type 2
// < what t1 and t2 mean
UNITY.map_combination = function(t1, t2) {
	if ((t1 == "human" && t2 == "wave") || (t1 == "wave" && t2 == "human")) {
		return "nuke"
	} else if ((t1 == "human" && t2 == "celluar") || (t1 == "celluar" && t2 == "human")) {
		return "farm"
	} else if ((t1 == "human" && t2 == "human") || (t1 == "human" && t2 == "human")) {
		return "city"
	} else if ((t1 == "human" && t2 == "water") || (t1 == "water" && t2 == "human")) {
		return "oilspill"
	} else if ((t1 == "wave" && t2 == "celluar") || (t1 == "celluar" && t2 == "wave")) {
		return "birds"
	} else if ((t1 == "wave" && t2 == "wave") || (t1 == "wave" && t2 == "wave")) {
		return "volcanoe"
	} else if ((t1 == "wave" && t2 == "water") || (t1 == "water" && t2 == "wave")) {
		return "huricane"
	} else if ((t1 == "water" && t2 == "water") || (t1 == "water" && t2 == "water")) {
		return "monsoon"
	} else if ((t1 == "water" && t2 == "celluar") || (t1 == "celluar" && t2 == "water")) {
		return "trees"
	} else if ((t1 == "celluar" && t2 == "celluar") || (t1 == "celluar" && t2 == "celluar")) {
		return "greenhouse"
	}
	return "some unknown combo..."
}

// Message the winner type to unity
// > winner element types
// msgs unity
UNITY.msg = function(socket, winner1, winner2) {
	var t = new Date().getTime(),
		element = UNITY.map_combination(winner1, winner2);
	console.log("===\n" + winner1 + "\n" + winner2 + "\n" + element + "\n===");
	var out = {
		"time": t,
		"type": element
	};
	socket.emit("reciver", out);
	socket.emit("pairing_" + element, out);
}


exports.UNITY = UNITY;