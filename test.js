const testFolder = './playlist/';
const fs = require('fs');
var playlist = [];
fs.readdir(testFolder, (err, files) => {
	files.forEach(file => {
		playlist.push(file);
		console.log(file);
	});
})

console.log(playlist);