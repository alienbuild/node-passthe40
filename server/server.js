const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

// Grab the public folder
const publicPath = path.join(__dirname, '../public/public');

// Start the app and init socket io
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Server the public folder
app.use(express.static(publicPath));

// New connection
io.on('connection', (socket) => {
   console.log('New user connected');

   // Welcome new user
   socket.emit('newMessage', generateMessage('passthe40', 'Welcome to Pass the 40.'));

   // Announce new user
   socket.broadcast.emit('newMessage', generateMessage('passthe40', 'New user joined.'));

   // Create message event
   socket.on('createMessage', (message, callback) => {
      console.log(message);
      io.emit('newMessage', generateMessage(message.from, message.text));
      callback();
   });

   // Coin Flip
   socket.on('flip', () => {
      io.emit('coinFlip', { result: 'Coin has been flipped...' });
      setTimeout(() => {
         let result = '';
         x = (Math.floor(Math.random() * 2) == 0);
         if (x) {
             result = 'Heads';
         } else {
             result = 'Tails';
         }
         io.emit('coinFlip', { result: `Coin landed on ${result}` });
      }, 1500);
   });

   // Disconnected
   // socket.on('disconnect', () => {
   //    console.log('User has disconnected.');
   // });

});



// Listen for requests
server.listen(port, () => {
   console.log(`Pass the 40 running on port ${port}`);
});