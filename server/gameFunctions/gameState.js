
const BOARD_HEIGHT = 1000
const BOARD_WIDTH = 600
const FOOD_INTERVAL = 1000
const EAT_RADIUS = 3

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
    console.log('vectors ENGAGE!',mouseX, mouseY, playerX, playerY)
		let x = mouseX - playerX ;
		let y = mouseY  - playerY ;
		const vecLen = Math.sqrt(Math.pow(x, 2) + Math.pow(y,2))
		x = x / vecLen * 10;
		y = y / vecLen * 10;
		return {xVector : playerX + x, yVector: playerY + y}
	}
// ***********************************
//  Adds, updates, gets, and removes
// ***********************************


  // ***********************************
  //  Mice
  // ***********************************
  updateMousePos(mouseObj){
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
  updatePlayer(id){
    const mouseX  = this.getMousePos(id).x
    const mouseY  = this.getMousePos(id).y

    console.log("this.getPlayer",this.getPlayer(id))
    var {x, y} = this.getPlayer(id)
    var {xVector, yVector} = this.vector(mouseX, mouseY, x, y)
    this.players[id].x = xVector
    this.players[id].y = yVector
  }

  getPlayer(id){
    console.log('whaaaaat',id, this.players)
    return this.players[id]
  }

  removePlayer(removeId){
    delete this.players[removeId]
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
