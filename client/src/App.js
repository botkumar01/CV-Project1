import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Client from './Pages/Client';
import Helper from './Pages/Helper';
import Chat from './Pages/Chat';
import OpenChat from './Components/OpenChat';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import CallPage from './Pages/CallPage';
import HelperRequest from './Pages/HelperRequest';
import Cryptopages from './Pages/Cryptopages';

function App() {
  const [User, setUser] = useState(undefined);
  const [Chats, setChat] = useState(undefined);
  const socket = useRef();

  useEffect(() => {
    if (User) {
      const socketURL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3500' 
        : 'https://cv-project1-backend.vercel.app/';  // Change to your production backend URL

      socket.current = io(socketURL);
      socket.current.emit("add-user", User._id);
    }
  }, [User]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client" element={<Client setUser={setUser} setChat={setChat} />} />
        <Route path="/helper" element={<Helper />} />
        <Route path="/request" element={<HelperRequest setUser={setUser} />} />
        <Route path="/chat-page" element={<Chat />} />
        <Route path="/crypto" element={<Cryptopages />} />
        <Route path="/test" element={<CallPage Chats={Chats} />} />
        <Route path="/priv-chat" element={<OpenChat Chats={Chats} User={User} socket={socket} />} />
      </Routes>
    </>
  );
}

export default App;
