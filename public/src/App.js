import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import io from 'socket.io-client';

// Pages
import Login from './components/pages/Login';
import Chat from './components/pages/Chat';

// Assets
import './assets/css/aliens.css';

// Define socket
const socket = io();

// On connect
socket.on('connect', () => {
    console.log('Connected to the server.');
});

// On disconnect
socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
});

class App extends Component {
  render() {
    return (
        <Router>
          <div className="App">
              <Route exact path="/" component={Login}/>
              <Route exact path="/chat" component={Chat} />
          </div>
        </Router>
    );
  }
}

export default App;