import React, { Component } from 'react';
import io from 'socket.io-client';
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
    li.className = "message broadcast";
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
        }, () => {
            // Clear the input value
            let messageInput = document.querySelector('#message');
            console.log(messageInput);
            messageInput.value = '';
        });
    };

    coinFlip = (e) => {
      e.preventDefault();
      socket.emit('flip');
    };

  render() {
    return (
      <div className="App">
          <aside>
              <h3>Users</h3>
          </aside>
          <main>
              <ol id="messages"></ol>
              <footer>
                  <form onSubmit={this.handleSubmit}>
                      <input
                          type="text"
                          id="message"
                          name="message"
                          placeholder="message..."
                          onChange={this.handleChange}
                          autocomplete="off"
                          autoFocus="on"
                      />
                      <button type="submit">Send</button>
                  </form>
                  <button id="coin-flip" onClick={this.coinFlip}>Flip</button>
              </footer>
          </main>
      </div>
    );
  }
}

export default App;