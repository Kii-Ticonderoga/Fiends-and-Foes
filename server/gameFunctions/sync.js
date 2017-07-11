//  ***********************************
// Imports
//  ***********************************
const socketServer = require('socket.io')
const express = require('express');
const http = require('http')

class Sync {
  constructor(){
    this.players = []
    this.lasers = []
    this.foods = []
    this.lastLaserId = 0

  }

  //  ***********************************
  //  Syncing system
  //  ***********************************

  //    --- The parameters in each function are arrays of objects
  syncPlayers(playersData){
    if(this.players != playersData){
      this.players = playersData
      return true
    }else{
      return false
    }
  }

  syncLasers(lasersData){
    if(this.lasers != lasersData){
      this.lasers = lasersData
      return true
    }else{
      return false
    }
  }

  syncFoods(foodsData){
    if(this.foods != foodsData){
      this.foods = foodsData
      return true
    }else{
      return false
    }
  }

  //  ***********************************
  //  Broadcast System
  //  ***********************************

  getPlayers(){
    return this.players
  }

  getLasers(){
    return this.lasers
  }

  getFoods(){
    return this.foods
  }
}
module.exports = Sync
