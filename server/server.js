const path = require('path');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');
const { Users } = require('./utils/users');

const usersAPI = require('./routes/api/users');

const app = express();
// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Server vars
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
const publicPath = path.join(__dirname, '../public/public');

// Database
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected.'))
    .catch( (err) => console.log('err'));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Start the app and init socket io
app.use(express.static(publicPath));
app.use('/api/users', usersAPI);

// New connection
io.on('connection', (socket) => {
   console.log('New user connected');

   // Join
   socket.on('join', (params, callback) => {
      // REMINDER: Write validation!
      socket.join(params.room);
      console.log(`${params.user} joined ${params.room}`);
      // Remove user
      users.removeUser(socket.id);
      // Add user
      users.addUser(socket.id, params.user, params.room);
      // Emit Users
      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      // Requested User List
      socket.on('updateUserList', () => {
         io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      });
      // Welcome user
      io.to(params.room).emit('newMessage', generateMessage('passthe40', 'Welcome to Pass the 40.'));
      // Announce user
      socket.broadcast.to(params.room).emit('newMessage', generateMessage('passthe40', `${params.user} has joined.`));
      callback();
   });

   // Create message event
   socket.on('createMessage', (message, callback) => {
      console.log(message);
      const user = users.getUser(socket.id);
      // REMINDER: Add validation for empty messages and spam preventation.
      // ie: if user and not string/empty
      if (user) {
         io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      }
      callback();
   });

   // Disconnected
   socket.on('disconnect', () => {
      var user = users.removeUser(socket.id);
      if (user.name) {
         console.log(`${user.name} has disconnected.`);
      } else { console.log('User has disconnected.'); }
      if (user) {
          io.to(user.room).emit('updateUserList', users.getUserList(user.room));
          io.to(user.room).emit('newMessage', generateMessage('Passthe40', `${user.name} has left.`));
      }
   });

   // Coin Flip
   socket.on('flip', () => {
      const user = users.getUser(socket.id);
      io.to(user.room).emit('coinFlip', { result: 'Coin has been flipped...' });
      setTimeout(() => {
         let result = '';
         x = (Math.floor(Math.random() * 2) == 0);
         if (x) {
            result = 'Heads';
         } else {
            result = 'Tails';
         }
         io.to(user.room).emit('coinFlip', { result: `Coin landed on ${result}` });
      }, 1500);
   });

});


// Listen for requests
server.listen(port, () => {
   console.log(`Pass the 40 running on port ${port}`);
});