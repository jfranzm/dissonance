import './DirectMessages.css';
import FriendList from '../../components/FriendList/FriendList';
import Message from '../../components/message/message';
import Chat from '../../components/Chat/Chat';
import { useState, useEffect, useRef } from "react";
import axios from 'axios';

export default function DirectMessages({user}) {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            chatId: currentChat._id
        };
        try {
            const res = await axios.post("api/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch(err) {
            console.log(err);
        }
    }
    // friends list
    useEffect(() => {
        const getChats = async() => {
            try {
                const res = await axios.get("/api/chats/"+user._id)
                setChats(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        getChats();
    }, [user._id])
    console.log(currentChat);

    // return messages
    useEffect(() => {
        const getMessages = async () => {
            try {
            const res = await axios.get("/api/messages/" + currentChat?._id);
            setMessages(res.data);
            } catch(err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    console.log(messages);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: "smooth"});
    },[messages])
    return (
        <>
            <div className='DirectMessage'>
                <div className="friend-bar">
                    <h3 className='friend-title'>Friends</h3>
                        {chats.map(chat => (
                            <div onClick={()=> setCurrentChat(chat)}>
                                <Chat chat={chat} currentUser={user}/>
                            </div>
                        ))}
                    </div>
                    <div className='chat-box'>
                        <div className="chat-box-wrapper">
                            {
                                currentChat ?
                                <>
                                <div className='user-info-bar'>
                                    <h2>{user?.username}</h2>
                                </div>
                                <div className='user-info'>
                                    <div className='pfp'></div>
                                    <h4>User1</h4>
                                </div>
                                <div className="chat-box-top">
                                    {messages.map((message) => (
                                        <div ref={scrollRef}>
                                            <Message message={message} own={message.sender === user._id}/>
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-box-bottom">
                                    <input 
                                        type="text" 
                                        className='chat-input' 
                                        placeholder='write something...' 
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    />
                                    <button className='chat-submit' onClick={handleSubmit}>Send</button>
                                </div>
                            </>:
                            <span className='no-convo-text'>Open a conversation!</span>
                            }
                        </div>
                    </div>
                    
                </div>
        </>
    )
}