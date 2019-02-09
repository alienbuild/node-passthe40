const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Grab the public folder
const publicPath = path.join(__dirname, '../public');

// Start the app and init socket io
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Server the public folder
app.use(express.static(publicPath));

// New connection
io.on('connection', (socket) => {
   console.log('New user connected');

   // Emit events
   socket.emit('newMessage', {
      from: 'LK',
      text: 'Sup dude.',
      createdAt: new Date()
   });

   // Create message event
   socket.on('createMessage', (message) => {
      console.log(message);
   });

   // Disconnected
   socket.on('disconnect', () => {
      console.log('User has disconnected.');
   });

});

// Listen for requests
server.listen(port, () => {
   console.log(`Pass the 40 running on port ${port}`);
});