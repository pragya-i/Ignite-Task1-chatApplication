
const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

// Prompt for username and room
const username = prompt('Enter your username');
const room = prompt('Enter the room you want to join');

// Ensure username and room are not null or empty
if (!username || !room) {
    alert('Username and room are required');
    throw new Error('Username and room are required');
}

socket.emit('joinRoom', { username, room });

// Listen for previous messages
socket.on('previousMessages', (messages) => {
    messages.forEach(message => {
        displayMessage(message);
    });
});

// Listen for new messages
socket.on('message', (message) => {
    displayMessage(message);
});

sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        socket.emit('chatMessage', { username, room, message });
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = messageInput.value;
        if (message) {
            socket.emit('chatMessage', { username, room, message });
            messageInput.value = '';
        }
    }
});

function displayMessage({ username, message }) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${username}: ${message}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
}
