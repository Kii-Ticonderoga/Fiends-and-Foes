//  ***********************************
//  Imports
//  ***********************************
import Konva from 'konva'
import React, { Component } from 'react';
import io from "socket.io-client"
import FiendPlayer from './fiendPlayer'

const PAGE_WIDTH = window.innerWidth * 5/6
const PAGE_HEIGHT = window.innerHeight * 9/10

//  ***********************************
//  Testing server connections
//  ***********************************

class Test extends Component {
  constructor(){
    super()
    this.socket = io.connect('https://fiendsandfoes.herokuapp.com')
    this.fiend = new FiendPlayer(this.socket)
    this.stage =''
    this.konvaObj =[]
    this.konvaLayers = []
    this.playerText = new Konva.Text({
      x: window.innerWidth *5/6 + 5,
      y: 20,
      text: "Score: ",
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: "black"
    })

  }

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min
  }
  getRandomColor(){
    return ["red","blue","yellow","green","orange","black","purple"][Math.round(Math.random() * 6)]
  }

//   addPlayerButton(){ // for button
// //    --- Updates our array of players in the data object
//     if(this.input && isNaN(this.input)){
//       var initX = this.getRandomInt(0, PAGE_WIDTH)
//       var initY = this.getRandomInt(0, PAGE_HEIGHT)
//       this.fiend.gameData.players.push({
//         x:initX,
//         y:initY,
//         name:this.input
//       })
//       console.log("Added user, the gameData now is ", this.fiend.gameData)
//       this.socket.emit('sync', this.fiend.gameData)
//       console.log("Synced new user")
//     }
//
//   }

  mapGen(){
		var mapLayer = new Konva.Layer();
    this.topTenLayer = new Konva.Layer();

		var circleMap = new Konva.Rect({
			x:0,
			y:0,
      width:PAGE_WIDTH,
      height: PAGE_HEIGHT,
			fill: "black",
			stroke: "red",
			stokeWidth: 5
		})

		mapLayer.add(circleMap);
    this.topTenLayer.add(this.playerText);
		this.stage.add(mapLayer);
    this.stage.add(this.topTenLayer);
    //this.stage.add(this.genFoodLayer());
    var laserLayer = new Konva.Layer();
    var laser = ""

    this.fiend.konvaLayers.forEach((layer)=> {
      this.stage.add(layer)
    })
    console.log(this.fiend.playerObj)
    Object.values(this.fiend.playerObj).map((player) => {
      if (player.isLocal){
        this.mouseControls(circleMap, laserLayer, player)
      }
    })

	}

  mouseControls(circleMap, laserLayer, player){
    var self = this
    var laser = ""
    circleMap.on("mousemove", function(){
      var mousePos = self.stage.getPointerPosition();
      this.fiend.setPos(mousePos.x, mousePos.y, player)
    })

    /**************************************************************************
    add these functions in da futur
    **************************************************************************/

    // circleMap.on("mousedown", function() {
    //   console.log("mousedown")
    //   var mousePos = self.stage.getPointerPosition();
    //   var laser = new Laser(player.getPlayerX(), player.getPlayerY(), mousePos.x, mousePos.y) // --- player will need to be defined
    //   this.state.lasers.push(laser)
    //   laserLayer.add(laser)
    //   self.stage.add(laserLayer)
    //   console.log(laser);
    //
    //
    //   var laserData = {
    //     xStart: laser.getStartX(),
    //     yStart: laser.getStartY(),
    //     xEnd: laser.getEndX(),
    //     yEnd: laser.getEndY(),
    //     id: ""
    //   }
    //   this.state.players.forEach( player => {
    //     if (player.x == laserData.xStart && player.y == laserData.yStart){
    //       laserData.id = player.id
    //     }
    //   })
    //
    //   socket.emit("shoot", laserData)
    //
    // })
    //
    // circleMap.on("mouseup", function() {
    //   console.log("mouse up");
    //   laserLayer.destroyChildren();
    //   console.log("children destroyed ", laserLayer.destroyChildren())
    // })
    //
    // laserLayer.on("mouseup", function() {
    //   console.log("mouse up");
    //   laserLayer.destroyChildren();
    //   console.log("children destroyed ", laserLayer.destroyChildren())
    // })

  }

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // removePlayerButton(){
  //   this.fiend.gameData.players.splice(this.input, 1)
  //   console.log("removed player, the gameData now is ", this.fiend.gameData)
  // }

  componentDidMount(){

    this.stage = new Konva.Stage({
      container: "container",
      width: window.innerWidth,
      height: PAGE_HEIGHT
    })

    window.addEventListener("beforeunload", () =>{

      // Object.values(this.fiend.playerObj).forEach((obj)=> {
      //   if(obj.isLocal){
      //     player = obj
      //   }
      // })
      this.socket.emit("leaveGame", this.socket.id)
    })

    this.mapGen()

    this.socket.on('connect', ()=>{
      console.log('connected', this.socket)
      this.socket.on("firstupdate", (newData) => {

        this.socket.emit("joinGame", {})
        this.fiend.gameData = newData
        this.fiend.draw(newData, this.stage)
      })

      this.socket.on('update', (newData) => {
        console.log('IT\'S NEW DATA', newData)
        this.fiend.draw(newData, this.stage)
      })

      this.socket.on("addPlayer", (playerData) =>{
        this.fiend.gameData.players.push(playerData)
        this.socket.emit("sync", this.fiend.gameData)
      })

      this.socket.on('removePlayer', (playerObj) => {
        this.fiend.removePlayer(playerObj)
        this.fiend.destroyPlayer(playerObj)
        this.socket.emit("sync", this.fiend.gameData)
      })

    })

  }

  //  ***********************************
  //  Render GUI
  //  ***********************************


  render(){
    console.log("Render run")
    return(
      <div id="container"></div>
    )
  }
}
export default Test
