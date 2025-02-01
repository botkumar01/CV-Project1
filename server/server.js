const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// Update the frontend URL (new URL)
const frontendUrl = 'https://cv-project1.vercel.app';  // Replace with your frontend URL

// Use CORS middleware and specify which domains are allowed to access the backend
app.use(cors({
  origin: frontendUrl,  // Allow the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
  credentials: true,  // Allow cookies to be sent
}));

// Server connection
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io integration
const io = socket(server, {
  cors: {
    origin: frontendUrl,  // Allow the frontend URL
    methods: ['GET', 'POST'],
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;

  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', async (data) => {
    const sendUserSocket = await onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    }
  });
});

// Database connection
mongoose.connect(DB_URL).then(() => {
  console.log("Connected to the database");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', require('./ROUTES/authRoute'));
app.use('/user', require('./ROUTES/userRoute'));
app.use('/update', require('./ROUTES/updateRoute'));
app.use('/messages', require('./ROUTES/messageRoute'));
