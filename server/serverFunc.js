var express = require('express');
var app = express();
var socket_io = require('socket.io')
var counter = 0;

app.use(express.static(__dirname + '/www'));

// var server = app.listen(process.env.PORT || 3002, () =>{
//   var port = server.address().port;
//   console.log('Server running at port %s', port)
// });
//
// var io = socket_io(server);

class GameServer {
  constructor(){
    this.players = [];
    this.lasers = [];
    this.lastLaserId = 0;


 }

 addPlayer(player){
    this.players.push(player)
  }
  addLaser(laser){
    this.lasers.push(laser)
  }
  removePlayer(playerId){
    this.players = this.players.filter( (player) => {player.id != playerId})
  }

 syncPlayer(newPlayerData){
    this.players.forEach( (player) =>{
      if(player.id = newPlayerData.id){
        player.x = newPLayerData.x;
        player.y = newPlayerData.y;
      }
    })
  }

 syncLasers(){
    var self = this;
    this.lasers.forEach( (laser) => {
      self.detectCollision(laser);
    })
  }
 // need a few p5 collision functions to make this part work below
  detectCollision(laser){
    var self = this;

   this.players.forEach( (player) => {
      if(player.id != laser.id && collideLineCircle(blah, blah, blah)){
        self.removePlayer(player.id)
      }
    })
  }

  collideLineCircle( x1,  y1,  x2,  y2,  cx,  cy,  diameter) {

    var inside1 = this.collidePointCircle(x1,y1, cx,cy,diameter);
    var inside2 = this.collidePointCircle(x2,y2, cx,cy,diameter);
    if (inside1 || inside2) return true;

    // get length of the line
    var distX = x1 - x2;
    var distY = y1 - y2;
    var len = Math.sqrt( (distX*distX) + (distY*distY) );

    // get dot product of the line and circle
    var dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

    // find the closest point on the line
    var closestX = x1 + (dot * (x2-x1));
    var closestY = y1 + (dot * (y2-y1));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    var onSegment = this.collidePointLine(closestX,closestY,x1,y1,x2,y2);
    if (!onSegment) return false;

    // get distance to closest point
    distX = closestX - cx;
    distY = closestY - cy;
    var distance = Math.sqrt( (distX*distX) + (distY*distY) );

    if (distance <= diameter/2) {
      return true;
    }
    return false;
  }

  collidePointLine(px,py,x1,y1,x2,y2, buffer){
    // get distance from the point to the two ends of the line
  var d1 = this.dist(px,py, x1,y1);
  var d2 = this.dist(px,py, x2,y2);

  // get the length of the line
  var lineLen = this.dist(x1,y1, x2,y2);

  // since floats are so minutely accurate, add a little buffer zone that will give collision
  if (buffer === undefined){ buffer = 0.1; }   // higher # = less accurate

  // if the two distances are equal to the line's length, the point is on the line!
  // note we use the buffer here to give a range, rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
  }

  collidePointCircle(x, y, cx, cy, d) {
  //2d
  if( this.dist(x,y,cx,cy) <= d/2 ){
    return true;
  }
  return false;
  }

  dist(x1, y1, x2, y2){
      var distX = x1 - x2;
      var distY = y1 - y2;
      var distance = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2))
      return distance;
    }

 getData(){
    var gameData = {};
    gameData.players = this.players;
    gameData.lasers = this.lasers

   return gameData
  }
  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
module.exports = GameServer

// ---------------------------------------------------------------------------


// io.on(‘connection’, (socket){
//   console.log(“User connected to socket”);
//
//  socket.on(‘joinGame’, function(player){
//     console.log(player.id +' joined the game');
//     var initX = getRandomInt(40, 900);
//     var initY = getRandomInt(40, 500);
//     socket.emit(‘addPlayer’, {id: player.id, isLocal: true, x: initX, y: initY, isAlive: true});
//     socket.broadcast.emit(‘addPlayer’, {id: player.id, isLocal: false, x: initX, y: initY, isAlive: true})
//
//    gameServer.addPlayer({id: tank.id, isAlive: true })
//   })
//
//  socket.on(‘sync’, (data) => {
//     if(data.tank !== undefined){
//       gameServer.syncPlayer(data.player)
//     }
//
//    gameServer.syncLasers();
//
//    socket.emit(‘sync’, gameServer.getData)
//     socket.broadcast.emit(‘sync’, gameServer.getData)
//
//    counter++
//   })
//
//  socket.on(‘shoot’, (laser) => {
//     var laser = new Laser(laser.id, laser.xStart, laser.yStart, laser.xEnd, laser.yEnd);
//     gameServer.addLaser(laser)
//   })
//
//  socket.on(‘leavegame’, (playerId) => {
//     console.log(playerId + ' has left the game')
//     gameServer.removePlayer(playerId);
//     socket.broadcast.emit(‘removePlayer’, playerId)
//   })
// })
