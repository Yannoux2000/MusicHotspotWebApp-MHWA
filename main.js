var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var spawn = require('child_process').spawn;


var app = express();

app.use(express.static(path.join(__dirname, 'public')));
console.log("[STRT] : Serveur web lancé, port 8080");

var title = "Bienvenue Chosisez un Titre";
var playing = true;
var vlcoutput = "";
var volume = 150;

var vlc = spawn('rvlc', [path.join(__dirname, 'playlist/01. 99.mp3')]);

server = app.listen(8080);

//echantillon de musiques
// vlc.stdin.write("enqueue playlist/glue70 - Casin.mp3 \n");
// vlc.stdin.write("enqueue playlist/glue70 - Coral Fumes.mp3 \n");
// vlc.stdin.write("enqueue playlist/01. Shelter.mp3 \n");
// vlc.stdin.write("enqueue playlist/MDK - Too Hot For Pants [320kbps].mp3 \n");

//init du volume
vlc.stdin.write("volume " + volume + " \n");

var io = require('socket.io')(server);

	//quand on recois de la data
vlc.stdout.on('data', function(data){
	vlcoutput = data.toString();
});


io.sockets.on('connection',function(socket){

	socket.emit('Etat', 'Vous êtes connecté !');
	socket.emit('valVol',volume);
	socket.emit('valTle',title);

	socket.on('getTle',function(message){

		//demande le titre a vlc
		vlc.stdin.write('get_title \n');

		setTimeout(function(){
		},2000);
			title = vlcoutput.slice(0,-2).trim();
			socket.emit('valTle',title);
			console.log('[SEND] : Title = ' + title);
	});

	socket.on('setVol',function(message){
		//volume n'est pas un chiffre
		volume = parseInt(message);
		if(volume <=400){
			socket.emit('valVol',volume);
			vlc.stdin.write("volume " + volume + "\n");
			console.log("[RECV]  : Volume = " + volume);
		}
	});

	socket.on('getVol',function(message){
		socket.emit('valVol',volume);
		console.log("[SEND] : Volume = ");
	});

	socket.on('next',function(message){
		vlc.stdin.write("next \n");
		console.log("[RECV] : next");
	});

	socket.on('pause',function(message){
		if(playing){
			vlc.stdin.write("pause \n");
			console.log("[RECV] : pause");
			playing = false;
		}else{
			vlc.stdin.write("play \n");
			console.log("[RECV] : play");
			playing = true;
		}
	});

	socket.on('prev',function(message){
		vlc.stdin.write("prev \n");
		console.log("[RECV] : prev");
	});

});
app.post('/uploads', function(req, res){ // dans le cas d'une requete POST a l'url /upload

  var title = '';
  console.log("[RECV] : file incoming")
  // crée un objet incomingform
  var form = new formidable.IncomingForm();

  // enregistre dans /uploads
  form.uploadDir = path.join(__dirname, '/playlist');

  // lors de la reception, recupere le nom,
  // renome le fichier
  form.on('file', function(field, file){
  	title = file.name;
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  console.log('[POST]  : upload = ' + file.name);
  });

  // log any error
  form.on('error', function(err){
    console.log('[EROR] : An error has occured = \n' + err);
  });

  // quand les fichiers on été uploadé informe le client.
  form.on('end', function(){
	vlc.stdin.write("enqueue playlist/" + title + "\n");
    res.redirect('/');
  });

  //on décompose le message pour reformer le form
  form.parse(req);

});