//  ***********************************
// Imports
//  ***********************************

var app = require('express')();
const port = process.env.PORT || 3001;
const server = app.listen(port)
var io = require('socket.io')(server);
const GameState = require('./gameFunctions/gameState')
const state = new GameState();


const mongoose = require('mongoose')
const User = require('./models/UserModel')

//  ***********************************
//	Connecting to Mongo database
//  ***********************************

mongoose.connect('mongodb://localhost:27017/fiends_and_foes')
var db = mongoose.connection
db.on('error', ()=> {console.log( '---FAILED to connect to mongoose')})
db.once('open', () => {
	console.log( '+++Connected to mongoose')
})

//  ***********************************
//  Defining Global variables
//  ***********************************




//    --- Define what port we will have the sockets listening on

// ***********************************
// Testing Socket logic and connections
// ***********************************

// class Laser {
//   constructor(id, xStart, yStart, xEnd, yEnd){
//     this.id = id;
//     this.xStart = xStart;
//     this.yStart = yStart;
//     this.xEnd = xEnd;
//     this.yEnd = yEnd;
//   }


var connections = [];

//    ---Logging connections, and adding socket to connections array
io.on('connection', function (socket) {

	connections.push(socket)

	socket.on('joinGame', function(){
		console.log("joined game")
     state.addPlayer(socket.id)
     io.emit('addPlayer', state.getPlayer(socket.id));
   })



	 socket.on('disconnect', function(player){
		 console.log("disconnected", player)

	 });

		socket.on('leaveGame', (playerId) => {
			socket.emit('removePlayer', state.getPlayer(playerId))
			socket.broadcast.emit('removePlayer', state.getPlayer(playerId))
			state.removePlayer(playerId)

		})

	socket.on('shoot', (laser) => {
     var laser = new Laser(laser.id, laser.xStart, laser.yStart, laser.xEnd, laser.yEnd);
     gameServer.addLaser(laser)
   })

//		---Listens for sync emit
//		---gameData is an object with arrays for values

	socket.emit("firstupdate", state.toJS())
	setInterval(()=>io.emit('update', state.toJS()), 1000)

	socket.on('sync', (gameData) => {

	})

});
