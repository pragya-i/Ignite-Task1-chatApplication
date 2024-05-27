

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const User = require('./Modals/chatModal');
const Message = require('./Modals/chatModal');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Chat server is running');
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinRoom', ({ username, room }) => {
        if (!username || !room) {
            console.log('Invalid username or room');
            return;
        }
        socket.join(room);
        console.log(`${username} joined room: ${room}`);

        // Send welcome message to the user
        socket.emit('message', { username: 'Admin', message: `Welcome to ${room}`, room });

        // Broadcast to others in the room that a user has joined
        socket.broadcast.to(room).emit('message', { username: 'Admin', message: `${username} has joined the room`, room });

        // Send previous messages in the room to the new user
        Message.find({ room }).sort('timestamp').then(messages => {
            socket.emit('previousMessages', messages);
        });
    });

    socket.on('chatMessage', async ({ username, room, message }) => {
        if (!username || !room || !message) {
            console.log('Invalid chat message');
            return;
        }
        const newMessage = new Message({ username, room, message });
        try {
            await newMessage.save();
            io.to(room).emit('message', { username, message, room });
        } catch (err) {
            console.log('Error saving message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
