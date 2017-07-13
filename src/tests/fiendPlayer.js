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
    this.laserObj = {}
    this.konvaLayers = []
    this.laserKonvaLayers = []
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
      this.gameData.players.map(player => {
        const {x, y, id} = player;

        if(!id){
          this.destroyPlayer(player)
        }

        if(!this.playerObj[id]){
          this.playerObj[id] = player
          this.addKonva(stage, this.playerObj[id])
          this.setPos(this.playerObj[id].x,this.playerObj[id].y,this.playerObj[id].id)

        }

      })
  }

  getRandomColor(){
    var colorArr = ["red","blue","green","yellow","orange","purple","white","violet","brown","grey"]
    var randomNum = Math.floor(Math.random()* 11)
    return colorArr[randomNum]
  }

	setPos(x, y, id){
    var playerKonva = _.get(this, `playerObj[${id}].user`);
    if(playerKonva){
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

//    --- player is the actual player object ie konva
  destroyPlayer(player){
    if(player){
      var {id} = player
      this.konvaLayers.forEach( (layer, index) => {
        if (layer.id === id ){
          this.konvaLayers.splice(index,1)
          if(layer.konvaLayer){
            layer.konvaLayer.destroy()
          }
        }
      })
    }
  }

// ***********************************
// Lasers
// ***********************************

  drawLaser(stage, laserData){
    if (laserData){
      var {id} = laserData
      this.laserKonvaLayers.forEach( (layer, index) => {
        if (layer.id === id ){
          this.laserKonvaLayers.splice(index,1)
          if(layer.laserLayer){
            layer.laserLayer.destroy()
          }
        }
      })

      //Draw a konva line using defined variables
      this.laserObj.user = new Konva.Line({
        points: [laserData.startX, laserData.startY, laserData.endX, laserData.endY],
        stroke: this.getRandomColor(),
        strokeWidth: 2
      })

      let laserLayerObj = {}
      laserLayerObj.id = laserData.id
      laserLayerObj.laserLayer = new Konva.Layer()
      laserLayerObj.laserLayer.add(this.laserObj.user)
      this.laserKonvaLayers.push(laserLayerObj)
      stage.add(laserLayerObj.laserLayer)
    }
  }

  destroyLaser(laserData){
    if(laserData){
      var {id} = laserData
      this.laserKonvaLayers.forEach( (layer, index) => {
        if (layer.id === id ){
          this.laserKonvaLayers.splice(index,1)
          if(layer.laserLayer){
            layer.laserLayer.destroy()
          }
        }
      })
    }
  }

}
