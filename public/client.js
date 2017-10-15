var spanVol=document.getElementById('Vol');
var newVol=document.getElementById('txtVol');

var spanTle=document.getElementById('Tle');
var spanEtat=document.getElementById('Etat');
var file=document.getElementById('mp3');

var socket = io.connect('http://localhost:8080');

//bouton d'envoi de la nouvelle valeur de X
function setVolume(){
	socket.emit('setVol',newVol.value);
	console.log(newVol.value);
};

///////////////////////////////////////////////

function askNext(){
	socket.emit('next','');
	console.log('next !');
	socket.emit('getTle','');
};

function askPause(){
	socket.emit('pause','');
	console.log('toggle pause !');
}

function askPrev(){
	socket.emit('prev','');
	console.log('previous !');
	socket.emit('getTle','');
}

///////////////////////////////////////////////

//bouton pour récupérer X
function getRemoteInfo(){
	socket.emit('getVol', '');
	socket.emit('getTle','');
};

//le serveur envoie la valeur de x
socket.on('valVol', function(message){
	spanVol.innerHTML = message;
	newVol.value = message;
	console.log("Volume : " + message);
});

socket.on('valTle', function(message){
	spanTle.innerHTML = message;
	console.log("Title :" + message);
});

socket.on('Etat', function(message){
	spanEtat.innerHTML = message;
	console.log(message);
});
// setInterval(function(){
// 	socket.emit('getTle','');
// },3000);
