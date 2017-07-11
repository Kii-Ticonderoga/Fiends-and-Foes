//import io from 'socket.io-client'
import Konva from 'konva'


export default class FiendPlayer{
  constructor(socket){
    this.gameData = {
      players: [],
      lasers: [],
      foods: []
    }
    this.playerObj ={}
    this.konvaLayers = []
    this.socket = this.socket
  }

  removeKonva(){

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
    console.log("player in addKonva: ", player)

    let newObj = {}
    newObj.id = player.id
    newObj.konvaLayer = new Konva.Layer()
    newObj.konvaLayer.add(player.user)
    this.konvaLayers.push(newObj)
    stage.add(newObj.konvaLayer)

    // const layer = new Konva.Layer()
    // let newObj = {}
    // newObj.id = player.id
    // newObj.konvaLayer = layer
    // layer.add(player.user)
    // this.konvaLayers.push(newObj)
    // stage.add(layer)
  }

  draw(data, stage){
      this.gameData = data;
      data.players.map(player => {
        const {x, y, id} = player;
        if(!this.playerObj[id]){
          this.playerObj[id] = player
          this.addKonva(stage, this.playerObj[id])
        }
        this.setPos(x, y, this.playerObj[id].user)
      })
  }

  getRandomColor(){
    var colorArr = ["red","blue","green","yellow","orange","purple","black","white","violet","brown","grey"]
    var randomNum = Math.floor(Math.random()* 11)
    return colorArr[randomNum]
  }


  vector(mouseX, mouseY, playerX, playerY){
		let x = (mouseX - 500) - (playerX - 500);
		let y = (mouseY - 500) - (playerY - 500);
		const vecLen = Math.sqrt(Math.pow(x, 2) + Math.pow(y,2))
		x = x / vecLen * 10;
		y = y / vecLen * 10;
		return {xVector : playerX + x, yVector: playerY + y}
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
	   var anim = new Konva.Animation((frame) => {
      const { xVector, yVector } = this.vector(x, y, player.getX(), player.getY())
			 player.setX(xVector)
			 player.setY(yVector)
     }, this.konvaLayers);
	   anim.start()
	}


  //
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

    // Object.values(this.playerObj).forEach((obj)=> {
    //   console.log("looping, obj is: ", obj)
    //   if(id == obj.id){
    //     console.log("if statement ran", obj.user.getAncestors())
    //
    //     // obj.user.getAncestors()[0].destroyChildren()
    //     console.log("after destroy ", obj.user.getAncestors())
    //   }
    // })

    //player.user.destroy()
  }


  // this.socket.on('addPlayer', addData => {
  //   this.addPlayer(addData)
  //
  //   this.socket.emit('sync', this.state.gameData)
  //   this.socket.broadcast.emit('sync', this.state.gameData)
  // })
  //
  // this.socket.on('removePlayer', playerId => {
  //   console.log(playerId)
  // })
}
