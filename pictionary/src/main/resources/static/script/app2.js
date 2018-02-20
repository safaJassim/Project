var stompClient = null;

function connect() {
	//var socket = new SockJS('/gs-guide-websocket');
	
	var socket = new SockJS('http://localhost:8080/gs-guide-websocket');
	
		
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {

		console.log('Connected sjm: ' + frame);
		stompClient.subscribe('/topic/UpdateImage', function(greeting) {
			console.log("UpdateImage");
			showGreeting(greeting.body);
		});

		stompClient.subscribe('/topic/CheckStatus', function(status) {
			console.log("CheckStatus");
			checkStatus(status.body);

		});

	});
}

function disconnect() {
	if (stompClient !== null) {
		stompClient.disconnect();
	}
	setConnected(false);
	console.log("Disconnected");
}

function showGreeting(message) {

	let inputData = JSON.parse(message);

	var c = document.getElementById("canvas2");
	var ctx = c.getContext("2d")

	var img1 = new Image();
	img1.onload = function() {
		ctx.clearRect(0, 0, 200, 100);
		ctx.drawImage(img1, 0, 0);
	}
	img1.src = inputData.data;

	// ctx.drawImage(img1, 0, 0, 200,100);

}

function submit() {

	stompClient.send("/app/ResultComming", {}, JSON.stringify({
		'imageName' : $("#res").val()
	}));
}

function checkStatus(message) {
	console.log(message);
	let res = JSON.parse(message);

	if (res.code === "OK") {

		alert("OK");
		window.location = "http://localhost:8080";

	} else {
		alert("Error");

		window.location = "http://localhost:8080/index2.html";

	}

}

$(function() {
	connect();

	$("#submit").click(submit);

});
