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
    // this.socket = io.connect("http://192.168.137.143:3002")
  }

  home(){
    return (
      <div>
        <Link to="/play">
          <button>
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
            <Route exact path ="/play" component={()=> new Test()} />
          </div>
        </Router>
    );
  }
}

export default App;
