import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

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

// Event: New messages from the server
socket.on('newMessage', (message) => {

    // Grab dialog box
    const messages = document.querySelector('#messages');

    // Render messages
    const li = document.createElement('li');
    const text = document.createTextNode(`${message.from}: ${message.text}`);
    li.appendChild(text);
    messages.appendChild(li);

});

// Event: Coin Flip
socket.on('coinFlip', (result) => {
    console.log(result);

    // Grab dialog box
    const messages = document.querySelector('#messages');

    // Render messages
    const li = document.createElement('li');
    li.className = "message-broadcast";
    const text = document.createTextNode(`${result.result}`);
    li.appendChild(text);
    messages.appendChild(li);
});


class App extends Component {

    state = {
        message: ''
    };

    handleChange = (e) => {
      console.log(e.target.value);
      this.setState({
          message: e.target.value
      })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        // Event: Send message
        socket.emit('createMessage',{
            from: 'User',
            text: this.state.message
        }, function () {
            console.log('good.');
        });
    };

    coinFlip = (e) => {
      e.preventDefault();
      socket.emit('flip');
    };

  render() {
    return (
      <div className="App">
          <ol id="messages"></ol>
          <form onSubmit={this.handleSubmit}>
              <input type="text" name="message" placeholder="message..." onChange={this.handleChange} />
              <button type="submit">Send</button>
          </form>
          <button id="coin-flip" onClick={this.coinFlip}>Flip</button>
      </div>
    );
  }
}

export default App;
