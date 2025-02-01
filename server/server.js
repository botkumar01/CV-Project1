const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://cv-project1.vercel.app', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true, // Allow cookies and credentials (if needed)
  })
);

// Handle preflight requests
app.options('*', cors()); // Allow preflight requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Routes
app.use('/auth', require('./ROUTES/authRoute'));
app.use('/user', require('./ROUTES/userRoute'));
app.use('/update', require('./ROUTES/updateRoute'));
app.use('/messages', require('./ROUTES/messageRoute'));

// Server Connection
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO Integration
const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://cv-project1.vercel.app', // Allow Socket.IO connections from your frontend
    methods: ['GET', 'POST'],
  },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;

  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.message); // Corrected typo: 'msg-recieve' -> 'msg-receive'
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
