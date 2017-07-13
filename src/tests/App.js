//  ***********************************
//  Imports
//  ***********************************

import React, { Component } from 'react';
import Test from "./Test"
import io from "socket.io-client"
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

//  ***********************************
//  Handles user creation and contains routes to game
//  ***********************************

class App extends Component {
  constructor(props){
    super(props)
    this.home = this.home.bind(this)

  }

  home(){
    return (
      <div >
        <h1 style = {{backgroundColor: "black", padding: "20px", color: "red", fontSize: "100px", position: "absolute", left: "35%", marginTop: "10%" }}>TRIPLINE</h1>
        <Link to="/play">
          <button style = {{backgroundColor: "black", color: "red", width: 250 + "px", height: 40 +"px", position: "absolute", left: "40%", marginTop: "20%"}}>
            PLAY
          </button>
        </Link>
      </div>
    )
  }

  render() {
    return (
        <Router>
          <div>
            <Route exact path="/" component={this.home} />
            <Route path ="/play" component={()=> new Test()} />
          </div>
        </Router>
    );
  }
}

export default App;
