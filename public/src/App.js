import React, { Component } from 'react';
import io from 'socket.io-client';
import moment from 'moment';

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

    var formattedTime = moment(message.createdAt).format('h:mm a');
    console.log(formattedTime);

    // Grab dialog box
    const messages = document.querySelector('#messages');

    // ** Render messages **

    // Create li element for data
    const li = document.createElement('li');

    // Create timestamp element
    const timestamp = document.createElement('time');
    const time = document.createTextNode(`${formattedTime}`);
    timestamp.appendChild(time);

    // Create message string
    const text = document.createTextNode(`${message.from}: ${message.text}`);

    // Append timestamp and text to new li element
    li.appendChild(timestamp);
    li.appendChild(text);

    // Output
    messages.appendChild(li);

});

// Event: Coin Flip
socket.on('coinFlip', (result) => {

    // Grab dialog box
    const messages = document.querySelector('#messages');

    // Render messages
    // const li = document.createElement('li');
    // li.className = "message broadcast";
    // const text = document.createTextNode(`${result.result}`);

    const output = `<li class="message broadcast">${result.result}</li>`;

    // Display output
    //li.appendChild(text);
    messages.insertAdjacentHTML("beforeend", output);

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