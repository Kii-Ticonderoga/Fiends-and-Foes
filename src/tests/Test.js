//  ***********************************
//  Imports
//  ***********************************
import Konva from 'konva'
import React, { Component } from 'react';
import io from "socket.io-client"
import FiendPlayer from './fiendPlayer'
import _ from 'lodash';

const PAGE_WIDTH = window.innerWidth * 5/6
const PAGE_HEIGHT = window.innerHeight * 9/10

//  ***********************************
//  Testing server connections
//  ***********************************

class Test extends Component {
  constructor(){
    super()
    this.socket = io.connect(process.env.SOCKET_SERVER || 'https://fiendsandfoes.herokuapp.com')
    this.fiend = new FiendPlayer(this.socket)
    this.stage = ''
    this.localID =''
    this.konvaObj = []
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

  mapGen(){

		this.mapLayer = new Konva.Layer();
    this.topTenLayer = new Konva.Layer();

		this.circleMap = new Konva.Rect({
			x:0,
			y:0,
      width:PAGE_WIDTH,
      height: PAGE_HEIGHT,
			fill: "black",
			stroke: "red",
			stokeWidth: 5
		})

		this.mapLayer.add(this.circleMap);
    this.topTenLayer.add(this.playerText);
		this.stage.add(this.mapLayer);
    this.stage.add(this.topTenLayer);
    //this.stage.add(this.genFoodLayer());
    var laserLayer = new Konva.Layer();
    var laser = "";

    this.fiend.konvaLayers.forEach((layer)=> {
      this.stage.add(layer)
    })

    this.circleMap.on("mousemove", () => {
      const player =  _.get(this,`fiend.playerObj[${this.socket.id}].user`);
      if(player){
        console.log("if ran")

        var mousePos = this.stage.getPointerPosition();

        this.socket.emit("mouseMove", {id: this.localID, x: mousePos.x, y: mousePos.y})

      }
    })

	}

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

  //}

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }

  componentDidMount(){

    this.stage = new Konva.Stage({
      container: "container",
      width: window.innerWidth,
      height: PAGE_HEIGHT
    })

    window.addEventListener("beforeunload", () =>{
      this.socket.emit("leaveGame", this.socket.id)
    })

    this.mapGen()

    this.socket.on('connect', ()=>{
      console.log('connected', this.socket, this.socket.id)

      this.socket.on("firstupdate", (newData) => {

        this.socket.emit("joinGame", {})
        this.fiend.gameData = newData
        this.fiend.draw(newData, this.stage)
        this.fiend.localID = this.socket.id
      })

      this.socket.on('update', (newData) => {
        console.log("Testing 123 lauren is a bully", newData)
        //console.log('IT\'S NEW DATA', newData)
        var {x, y} = newData.mousePos[this.localID]
        var player = newData.players.filter(player => player.id == this.locaID)[0].user
        console.log("plauer: ", player)
        this.fiend.draw(newData, this.stage)
        this.fiend.setPos(x,y,player)
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
