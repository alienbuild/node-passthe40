// Dependencies
import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import io from 'socket.io-client';
import SocketContext from './context/socketContext';

// Pages
import Login from './components/pages/Login';
import Chat from './components/pages/Chat';

// Assets
import './assets/css/aliens.css';

// Define socket
const socket = io('http://localhost:3000',{
    forceNew: false
});

// On connect
socket.on('connect', () => {
    console.log('Connected to the server.');
});

// On disconnect
socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
});

// Define store (application state)
class App extends Component {
  render() {
    return (
        <SocketContext.Provider value={socket}>
            <Router>
              <div className="App">
                  <Route exact path="/" component={Login} socket={socket}/>
                  <Route exact path="/chat" component={Chat} socket={socket}/>
              </div>
            </Router>
        </SocketContext.Provider>
    );
  }
}

export default App;