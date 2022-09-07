import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
// import io from "socket.io-client";
import { v4 } from 'uuid';
import './App.css';


// const PORT = 3001;
// const socket = io(`http://localhost:${PORT}`);
const socket = io(`https://chat-app-backend-v1.herokuapp.com/`);

function App() {

  const [isConnected, setIsConnected] = useState(socket.isConnected);
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatIsVisible, setChatIsVisible] = useState(false);


  useEffect(() => {
    
    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    socket.on('receive_msg', (msg) => {
      setNewMessage((messages) => [...messages, msg]);
    });
  
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    }
  
  }, [isConnected, newMessage]) 

  
  useEffect(() => {
    socket.on("receive_msg", ({user, message}) => {
      const msg = `${user} send: ${message}`;
      setMessages(prevState => [msg, ...prevState]);
    });
  }, [socket, messages])


  const handleEnterChatRoom = () => {
    if (user !== "" && room !== "") {
      socket.emit("join_room", {user, room});
      setChatIsVisible(true);
    }
  }

  const handleSendMessage = () => {
    const newMsgData = {
      room: room,
      user: user,
      message: newMessage
    }
    socket.emit("send-msg", newMsgData);
    const msg = `${user} send: ${newMessage}`;
    setMessages(prevState => [msg, ...prevState]);
    setNewMessage("");

  }
    

  return (
    <div className="main">  
        <h1 className="logo">Chat (...in groups 😉)</h1>
        { !chatIsVisible ? 
          <>
            <input className="input-field" type="text" placeholder="Enter your name" value={user} onChange={(e) => setUser(e.target.value)} />
            <input className="input-field" type="text" placeholder="Enter room name" value={room} onChange={(e) => setRoom(e.target.value)} />
            <button className="btn-chat" onClick={handleEnterChatRoom}>Enter chat room</button>
          </>
          :
          <>
            <h5 className="chat-desc">Room: {room} | User: {user}</h5>
            <div className="chat-box">
              {messages.map((el => <div key={v4()}>{el}</div>))}
            </div>

            <input className="enter--message" type="text" placeholder="Enter message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button className="btn-chat" onClick={handleSendMessage}>Send message</button>
          </>
        }
    </div>
  );
}

export default App;
