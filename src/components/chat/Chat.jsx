import './chat.css'
import { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import upload from '../../lib/uploads.js'
//import { format } from 'timeago.js'

const Chat = () => {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [chat, setChat] = useState(null)
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji)
    }
    const endRef = useRef()
    const { currentUser } = useUserStore()
    const { chatId } = useChatStore()

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'chats', chatId), (res) => {
            setChat(res.data())
        })
        return () => {
            unsub()
        }
    }, [chatId])

    console.log(chat)
    const handleSend = async () => {
        if (text === '') return

        try {
            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                }),
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <span>Roshan Ali</span>
                        <p>Lorem ipsum dolor sit amet, qui minim labore</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message) => (
                    <div className="message own" key={message.createdAt}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            {/*<span>{message.createdAt}</span>*/}
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message.."
                />
                <div className="emoji">
                    <img
                        src="./emoji.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat
