//import io from 'socket.io-client'
import Konva from 'konva'


export default class FiendPlayer{
  constructor(socket){
    this.gameData = {
      players: [],
      mousePos: {},
      lasers: {}
    }

    this.playerObj ={}
    this.konvaLayers = []
    this.socket = socket
    this.localID = ""
  }

  addKonva = (stage, player) => {
    var {x,y} = player
    player.user = new Konva.Circle({
      x: x,
      y: y,
      radius: 10,
      fill: this.getRandomColor(),
      stroke: "white",
      strokeWidth:2
    })

    let newObj = {}
    newObj.id = player.id
    newObj.konvaLayer = new Konva.Layer()
    newObj.konvaLayer.add(player.user)
    this.konvaLayers.push(newObj)
    stage.add(newObj.konvaLayer)
  }

  draw(data, stage){
      this.gameData = data;

      data.players.map(player => {
        const {x, y, id} = player;
        if(!this.playerObj[id]){
          this.playerObj[id] = player
          this.addKonva(stage, this.playerObj[id])
        }

      })
  }

  getRandomColor(){
    var colorArr = ["red","blue","green","yellow","orange","purple","black","white","violet","brown","grey"]
    var randomNum = Math.floor(Math.random()* 11)
    return colorArr[randomNum]
  }

	getPlayerX(player){
		return player.getX()
	}

	getPlayerY(player){
		return player.getY()
	}

	getPlayerRadius(player){
		return player.getRadius()
	}

	setPos(x, y, player){
    var playerX = player.getX()
    var playerY = player.getY()
	   var anim = new Konva.Animation((frame) => {
			 player.setX(x)
			 player.setY(y)
     }, this.konvaLayers);
	   anim.start()
	}

  addPlayer(player){
    this.gameData.players.push(player)
  }

  removePlayer(playerId){
    this.gameData.players.filter( (player) => player.id != playerId)
    this.konvaLayers.filter( layerObj => playerId != layerObj.id)
    this.gameData.players.map( player => player.isAlive = false)
  }

  destroyPlayer(player){
    console.log("Destrot player ", player)
    var {id} = player
    console.log("Array of konva Layers, ",this.konvaLayers)
    this.konvaLayers.forEach( (layer) => {
      console.log("looping layers :", layer)
      if (layer.id === id ){
        console.log("if ran")
        layer.konvaLayer.destroyChildren()
        console.log("children destroyed ", layer.konvaLayer.destroy() )
      }
    })
  }
}
