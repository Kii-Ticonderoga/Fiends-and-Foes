
const BOARD_HEIGHT = 1000
const BOARD_WIDTH = 600
const FOOD_INTERVAL = 1000
const EAT_RADIUS = 3

class GameState {
  constructor(){
    this.players = {}
    this.food = []
    this.lasers = []
    setInterval(this.addRandomFood.bind(this), FOOD_INTERVAL)
  }

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }


  addRandomFood(){
    this.food.push({
      x: this.getRandomInt(0, BOARD_WIDTH),
      y: this.getRandomInt(0, BOARD_HEIGHT)
    })
  }



  eatFood(eatX, eatY){
    const uneaten = this.food.filter(({x,y}) => x < (eatX + EAT_RADIUS) || x > (eatX - EAT_RADIUS) )
    const eaten = this.food.length - this.uneaten.length
    this.food = uneaten
    return eaten
  }

  addPlayer(id){
    var initX = this.getRandomInt(40, Math.floor(BOARD_WIDTH * .90));
    var initY = this.getRandomInt(40, Math.floor(BOARD_WIDTH * .90));
    this.players[id] = {id: id, x: initX, y: initY, isAlive: true}
  }

  getPlayer(id){
    return this.players[id]
  }

  removePlayer(removeId){
    delete this.players[removeId]
  }

  toJS(){
    return {
      players : Object.keys(this.players).map(key => this.players[key]),
      food : this.food,
      lasers : this.lasers
    }
  }

}

module.exports = GameState
