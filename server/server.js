const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
app.use(cors());

//server connection

const server = app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})

//SOCKET.IO INTEGRATION

const io =  socket(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;

    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
    });
    socket.on("send-msg",async(data) => {
        const sendUserSocket = await onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', data.message);
        }
    });
});

//database connection

mongoose.connect("mongodb+srv://harish:hamarihk@cluster0.zmgaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("connected to the database");
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/auth', require('./ROUTES/authRoute'));
app.use('/user',require('./ROUTES/userRoute'));
app.use('/update',require('./ROUTES/updateRoute'));
app.use('/messages', require('./ROUTES/messageRoute'));
