//  ***********************************
// Imports
//  ***********************************
const express = require('express')
const path = require('path')
var app = express();
app.use(express.static(path.join(__dirname, '..', 'build')))
const port = process.env.PORT || 3001;
const RENDER_INTERVAL = 10
app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, '..','build', 'index.html'));
});

const server = app.listen(port)
var io = require('socket.io')(server);
const GameState = require('./gameFunctions/gameState')
const state = new GameState();

// ***********************************
// Socket logic and connections
// ***********************************

var connections = [];

//    ---Logging connections, and adding socket to connections array
io.on('connection', function (socket) {
  console.log("Connection established")
	connections.push(socket)

	socket.on('joinGame', function(mouse){
     state.addPlayer(socket.id)
     state.updateMousePosLocal(mouse)
     io.emit('addPlayer', state.getPlayer(socket.id));
     io.emit('syncLaser', state.getLasers())
   })

		socket.on('leaveGame', (playerId) => {
			socket.emit('removePlayer', state.getPlayer(playerId))
			socket.broadcast.emit('removePlayer', state.getPlayer(playerId))

      state.removePlayer(playerId)
      state.removeMousePos(playerId)
      state.removeLaser(playerId)

		})

    socket.on("mouseMove", (mouseData) => {
      state.updateMousePosLocal(mouseData)
      state.updatePlayer(mouseData.id, ()=>{
        state.removeLaser(mouseData.id)
        io.emit('removePlayer', {id: mouseData.id})
      })
    })

	socket.on('shoot', (id) => {
    state.removeLaser(id)
    if(state.getPlayer(id)){
      state.addLaser(id)
    }

    io.emit('fired', (state.getLaser(id)))
   })

	socket.emit("firstupdate", state.toJS())
	setInterval(()=>io.emit('update', state.toJS()), RENDER_INTERVAL)

});
