

const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/chat', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// MongoDB Schemas
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    }
});

const MessageSchema = new mongoose.Schema({
    username: { 
        type: String,
         required: true
         },
    message: { 
        type: String,
         required: true },
    room: { 
        type: String,
         required: true },
    timestamp: {
         type: Date,
          default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
module.exports = mongoose.model('Message', MessageSchema);
