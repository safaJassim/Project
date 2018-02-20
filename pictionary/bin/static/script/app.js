var stompClient = null;

let mousePos = {
	x : 0,
	y : 0
};

let lastMousePos;

function connect() {
	var socket = new SockJS('/gs-guide-websocket');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		
		
		 stompClient.subscribe('/topic/CheckStatus', function (status) {
	       	 console.log("CheckStatus");
	       	checkStatus(status.body);
	         
	       });
		

	});
}

let interval;
let mainTimerSet = false;

let drowingStoped = false;
let mouseIsDrowing = false;
let x = 0;

$(function() {


	connect();

	$("#canvas1").mousedown(function(event) {
		if(drowingStoped){
			return;
		}
		
		if(mainTimerSet == false){
			mainTimerSet = true;
			setTimeout(stopDrowing, 1000 * 5);			
		}
		
		lastMousePos = getMousePos(this, event);

		interval = setInterval(sendDrowing, 1000/60);

		mouseIsDrowing = true;

	});

	$("#canvas1").mouseup(function(event) {
		mouseIsDrowing = false;
		clearInterval(interval);
		sendDrowing();

	});

	$("#canvas1").mousemove(function(event) {

		if (mouseIsDrowing === true) {
			mousePos = getMousePos(this, event);
			var c = document.getElementById("canvas1");
			var ctx = c.getContext("2d");
			ctx.beginPath();
			ctx.moveTo(lastMousePos.x, lastMousePos.y);

			ctx.lineTo(mousePos.x, mousePos.y);
			
			console.log("colors:"+ $("#colors").val());
			ctx.strokeStyle = $("#colors").val();
			
			
			ctx.stroke();

			lastMousePos = mousePos;

		}

	});

});

function stopDrowing(){
	drowingStoped = true;
	mouseIsDrowing = false;
	clearInterval(interval);
	sendDrowing();
	
}

function sendDrowing() {

	var c = document.getElementById("canvas1");
	let data = c.toDataURL();

	

	stompClient.send("/app/ImageComming", {}, JSON.stringify({
		'data' : data
	}));
	
/*	stompClient.send("/app/ImageComming", {}, JSON.stringify({
		'data' : "test"
	}));*/

}

function getMousePos(canvas, evt) {
	let rect = canvas.getBoundingClientRect();
	return {
		x : evt.clientX - rect.left,
		y : evt.clientY - rect.top
	};
}


function checkStatus (message){
	console.log(message);
	let res = JSON.parse(message);
	
	if(res.code ==="OK"){
		alert("OK");
		window.location = "http://localhost:8080/index2.html";
	}else{
		alert("Error");
		
		 window.location = "http://localhost:8080";
		
	}
	
}

