const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// CORS configuration
app.use(cors({
  origin: 'https://cv-project1.vercel.app', // Replace this with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the methods you're using
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow the headers you're sending
  credentials: true, // Allow cookies or auth headers if necessary
}));

// Server connection
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO Setup
const io = socket(server, {
  cors: {
    origin: 'https://cv-project1.vercel.app', // Your frontend URL
    methods: ['GET', 'POST'],
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');
  global.chatSocket = socket;

  socket.on('add-user', (userId) => {
    global.onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', async (data) => {
    const sendUserSocket = await global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    }
  });
});

// Database connection
mongoose.connect(DB_URL).then(() => {
  console.log("Connected to the database");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', require('./ROUTES/authRoute'));
app.use('/user', require('./ROUTES/userRoute'));
app.use('/update', require('./ROUTES/updateRoute'));
app.use('/messages', require('./ROUTES/messageRoute'));
