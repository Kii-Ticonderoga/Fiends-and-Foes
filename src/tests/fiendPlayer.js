//import io from 'socket.io-client'
import Konva from 'konva';
import _ from 'lodash';


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
          this.setPos(this.playerObj[id].x,this.playerObj[id].y,this.playerObj[id].id)

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

	setPos(x, y, id){
    var playerKonva = _.get(this, `playerObj[${id}].user`);
    if(playerKonva){
      console.log('setting position', x,y,id,)
  	   var anim = new Konva.Animation((frame) => {
  			 playerKonva.setX(x)
  			 playerKonva.setY(y)
       }, this.konvaLayers.map(({konvaLayer}) => konvaLayer));
  	   anim.start()
   }
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
    var {id} = player
    this.konvaLayers.forEach( (layer) => {
      if (layer.id === id ){
        layer.konvaLayer.destroyChildren()
      }
    })
  }
}
