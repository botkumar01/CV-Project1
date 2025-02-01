import React, { useEffect, useRef, useState } from 'react';
import profile from '../img/profile.svg';
import Api from '../Api/Api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import {io} from 'socket.io-client'
import Menu from '../Components/Menu';

const Client = ({setUser,setChat}) => {
  const [helpers, setHelpers] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const socket = useRef();

  useEffect(() => {
    if (!localStorage.getItem('Mental-App')) {
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('Mental-App')));
      setUser(JSON.parse(localStorage.getItem('Mental-App')))
    }
  }, [navigate]);

  useEffect(()=>{
    if(currentUser){
      socket.current = io("http://localhost:3500")
      socket.current.emit("add-user",currentUser._id)
    }
  },[currentUser])
  
  useEffect(() => {
    const fetch = async () => {
      let user = JSON.parse(localStorage.getItem('Mental-App'));
      const response = await Api.post('/user/helpers', { language: user.language });
      console.log("Response Data: ", response.data);
      if (Array.isArray(response.data.helpers)) {
        setHelpers(response.data.helpers);
        console.log("yes");
      } else {
        setHelpers([]);
        console.log("No");
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    console.log("Helpers State: ", helpers);
  }, [helpers]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar key={index} color={index < rating ? '#FFD700' : '#e4e5e9'} />
    ));
  };
  

  return (
    <Container>
      <h1>Suggested Users</h1>
      <div className="menu">
        <Menu/>
      </div>
      <HelperList>
        {helpers && helpers.map((helper) => (
          <HelperBox key={helper._id} onClick={() =>{
            setChat(helper);
            navigate(`/priv-chat/`)}
          }>
            <img src={profile} alt="profile" />
            <HelperInfo>
              <h2>{helper.userName}</h2>
              <p>Age: {helper.age}</p>
              <p>Language: {helper.language}</p>
              <Stars>{renderStars(helper.ratings)}</Stars>
            </HelperInfo>
          </HelperBox>
        ))}
      </HelperList>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  background-color: #e8f5e9;
  min-height: 100vh;
  .menu {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  h1 {
    text-align: center;
    color: #4CAF50;
  }
`;

const HelperList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
`;

const HelperBox = styled.li`
  background-color: #ffffff;
  border: 1px solid #4CAF50;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  padding: 20px;
  width: 200px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
`;

const HelperInfo = styled.div`
  text-align: center;
  h2 {
    margin: 10px 0;
    color: #4CAF50;
  }
  p {
    margin: 5px 0;
    color: #388E3C;
  }
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export default Client;
