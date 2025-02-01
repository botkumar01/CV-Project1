const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

// Update the frontend URL (new URL)
const cors = require('cors');

// Define allowed origins
const allowedOrigins = [
  'https://cv-project1.vercel.app', // Frontend URL
];

// Enable CORS with OPTIONS handling
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle OPTIONS preflight request explicitly if needed
app.options('*', cors());


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
mongoose.connect("mongodb+srv://harish:hamarihk@cluster0.zmgaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
  console.log("Connected to the database");
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', require('./ROUTES/authRoute'));
app.use('/user', require('./ROUTES/userRoute'));
app.use('/update', require('./ROUTES/updateRoute'));
app.use('/messages', require('./ROUTES/messageRoute'));
