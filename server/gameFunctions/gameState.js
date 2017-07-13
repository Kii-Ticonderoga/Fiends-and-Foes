
const BOARD_HEIGHT = 1000
const BOARD_WIDTH = 600
const FOOD_INTERVAL = 1000
const EAT_RADIUS = 3
const PLAYER_RADIUS = 10
const MOVE_DIST = 5

const Collision = require('./collision')

const collide = new Collision()
class GameState {
  constructor(){
    this.players = {}
    this.lasers = {}
    this.mousePos = {}


    this.getPlayer = this.getPlayer.bind(this)
  }
// ***********************************
//  Math Functions
// ***********************************

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }

  vector(mouseX, mouseY, playerX, playerY){
		let x = mouseX - playerX ;
		let y = mouseY  - playerY ;
		const vecLen = Math.sqrt(Math.pow(x, 2) + Math.pow(y,2))
		x = x / vecLen * MOVE_DIST;
		y = y / vecLen * MOVE_DIST;
		return {xVector : playerX + x, yVector: playerY + y}
	}
// ***********************************
//  Adds, updates, gets, and removes
// ***********************************


  // ***********************************
  //  Mice
  // ***********************************
  updateMousePosLocal(mouseObj){
    if(this.mousePos[mouseObj.id]){
      this.mousePos[mouseObj.id].x = mouseObj.x
      this.mousePos[mouseObj.id].y = mouseObj.y
    }else{
      this.mousePos[mouseObj.id] = {
        id: mouseObj.id,
        x: mouseObj.x,
        y: mouseObj.y
      }
    }
  }

  // updateMousePosBroad(){
  //
  //   var mousePosArr = Object.keys(this.mousePos).map( key => this.mousePos[key])
  //
  //   mousePosArr.map( obj =>{
  //     var id = obj.id
  //     this.mousePos[id].x = obj.x
  //     this.mousePos[id].y = obj.y
  //   })
  // }

  removeMousePos(mouseID){
    delete this.mousePos[mouseID]
  }

  getMousePos(mouseID){
    return this.mousePos[mouseID]
  }

  // ***********************************
  // Players
  // ***********************************

  addPlayer(id){
    var initX = this.getRandomInt(40, Math.floor(BOARD_WIDTH * .90));
    var initY = this.getRandomInt(40, Math.floor(BOARD_WIDTH * .90));
    this.players[id] = {id: id, x: initX, y: initY, isAlive: true}
  }
  updatePlayer(id, onDeath){
    const mouseX  = this.getMousePos(id).x
    const mouseY  = this.getMousePos(id).y

    if(this.players[id]){
      var {x, y} = this.players[id]
      var {xVector, yVector} = this.vector(mouseX, mouseY, x, y)
      this.players[id].x = xVector
      this.players[id].y = yVector
    }

      this.playerDetection(onDeath)
  }

  playerDetection(onDeath){
    var laserArr = Object.keys(this.lasers).map((key) => this.lasers[key])
    var playerArr = Object.keys(this.players).map((key) => this.players[key])

    laserArr.forEach( (laserObj, index) => {
      playerArr.forEach((playerObj, index) => {
        var {startX, endX, startY, endY} = laserObj
        var {x,y} = playerObj

        var sameId = laserObj.id == playerObj.id
        var collision = collide.collideLineCircle(startX, startY, endX, endY, x, y, (PLAYER_RADIUS * 2))

        if (!sameId && collision){
          onDeath()
          this.removeLaser(playerObj)
          this.removePlayer(playerObj.id)

        }
      })
    })
  }

  getPlayer(id){
    return this.players[id]
  }


  removePlayer(removeId){
    delete this.players[removeId]
  }

  // ***********************************
  // Lasers
  // ***********************************

  getLaser(id){
    return this.lasers[id]
  }

  getLasers(){
    return Object.keys(this.lasers).map(key => this.lasers[key])
  }

  addLaser(id){
    var startX = this.players[id].x
    var startY = this.players[id].y

    var endX = this.mousePos[id].x
    var endY = this.mousePos[id].y

    this.lasers[id] = {
      id: id,
      startX: startX,
      startY: startY,
      endX: endX,
      endY: endY
    }
  }

  removeLaser(removeId){
    delete this.lasers[removeId]
  }

  toJS(){
    return {
      players : Object.keys(this.players).map( key => this.players[key]),
      mousePos: this.mousePos,
      lasers : this.lasers
    }
  }

}

module.exports = GameState
