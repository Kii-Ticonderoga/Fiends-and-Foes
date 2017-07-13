//  ***********************************
//  Imports
//  ***********************************
import Konva from 'konva'
import React, { Component } from 'react';
import io from "socket.io-client"
import FiendPlayer from './fiendPlayer'
import _ from 'lodash';

const PAGE_WIDTH = 1300
const PAGE_HEIGHT = 800

//  ***********************************
//  Testing server connections
//  ***********************************

class Test extends Component {
  constructor(){
    super()
    const socketServer = process.env.NODE_ENV === 'development' ? 'http://192.168.137.181:3001' : 'https://fiendsandfoes.herokuapp.com';
    console.log('Connecting to', socketServer)
    this.socket = io.connect(socketServer)
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

    var laserLayer = new Konva.Layer();
    var laser = "";

    this.fiend.konvaLayers.forEach((layer)=> {
      this.stage.add(layer)
    })

    this.circleMap.on("mousemove", () => {
      const player =  _.get(this,`fiend.playerObj[${this.socket.id}].user`);
      if(player){

        var mouse = this.stage.getPointerPosition();

        this.socket.emit("mouseMove", {id: this.socket.id, x: mouse.x, y: mouse.y})

      }
    })

    this.circleMap.on("mousedown", () => {
      this.socket.emit("shoot", (this.socket.id))
    })

	}

  getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  }

  componentDidMount(){

    this.stage = new Konva.Stage({
      container: "container",
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT
    })

    window.addEventListener("beforeunload", () =>{
      this.socket.emit("leaveGame", this.socket.id)
    })

    this.mapGen()

    this.socket.on('connect', ()=>{


      this.socket.on("firstupdate", (newData) => {
        this.fiend.localID = this.socket.id

        this.socket.emit("joinGame", {x: 0, y: 0, id: this.fiend.localID})
        this.fiend.gameData = newData
        this.fiend.draw(newData, this.stage)

      })

      this.socket.on("syncLaser", (laserData) => {
        laserData.map(laser => {
          this.fiend.drawLaser(this.stage, laser)
        })
      })

      this.socket.on('update', (newData) => {
        this.fiend.gameData = newData
        this.fiend.draw(newData, this.stage)

        const ids = this.fiend.gameData.players.map(({id}) => id)
        const playersPlay ={}
         this.fiend.gameData.players.forEach( (obj) =>{
           playersPlay[obj.id] = obj
         })
        ids.map(id => {
          var {x, y} = playersPlay[id] || {x:0, y:0}

          this.fiend.setPos(x,y,id)
        })
      })

      this.socket.on("addPlayer", (playerData) =>{
        this.fiend.gameData.players.push(playerData)

      })

      this.socket.on('removePlayer', (playerObj) => {
        if(playerObj){
          if(playerObj.id === this.socket.id){
            this.props.history.push('/')
          }
          this.fiend.destroyLaser( this.fiend.gameData.lasers[playerObj.id])
          this.fiend.removePlayer(playerObj)
          this.fiend.destroyPlayer(playerObj)

        }

      })

      this.socket.on('fired', (laserData) => {
        this.fiend.drawLaser(this.stage, laserData)
      })

    })

  }

  //  ***********************************
  //  Render GUI
  //  ***********************************


  render(){
    return(
      <div id="container"></div>
    )
  }
}
export default Test
