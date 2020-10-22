const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

io.on('connection', (socket) => {
	console.log(`New web socket connection!`);
	console.log(socket.id);

	// Send message to a particular user/socket id
	// io.to(socketID).emit('new message', messageContent);

	io.to(socket.id).emit('welcome', {
		message: `Welcome ${socket.id}`
	});

	socket.on('message', ({ to, from, message }) => {
		console.log(`Message sent from ${from} to ${to}`);
		console.log(`=> ${message}`);

		socket.broadcast.emit('new_message', { message });
	});

	socket.on('disconnect', () => {
		console.log(`A user has been disconnected`);
		console.log(socket.id);
	});	
});

server.listen(PORT, () => {
	console.log(`Web socket server listening on PORT ${PORT}`);
})