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
    // Format the timestamp
    const time = moment(message.createdAt).format('h:mm a');
    // Grab dialog box
    const messages = document.querySelector('#messages');
    // Set the template
    const output = `<li><time>${time}</time> ${message.from}: ${message.text}</li>`;
    // Output the message
    messages.insertAdjacentHTML("beforeend", output);

});

// Event: Coin Flip
socket.on('coinFlip', (result) => {
    // Grab dialog box
    const messages = document.querySelector('#messages');
    // Set the template
    const output = `<li class="message broadcast">${result.result}</li>`;
    // Output the result
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
            const messageInput = document.querySelector('#message');
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