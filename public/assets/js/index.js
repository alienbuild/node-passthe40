var socket = io();

// On connect
socket.on('connect', () => {
    console.log('Connected to the server.');
});

// On disconnect
socket.on('disconnect', () => {
    console.log('Disconnected from the server.');
});

// Event: New Message
socket.on('newMessage', (message) => {
    console.log('New Message');
    console.log(message);
});