import './chat.css'
import { useState, useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'

const Chat = () => {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }
    const endRef = useRef()

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

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
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae impedit eaque culpa qui ad
                            provident et earum inventore ab accusamus. Natus
                            sunt nobis ex distinctio voluptatem deserunt eveniet
                            cumque fuga!
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae impedit eaque culpa qui ad
                            provident et earum inventore ab accusamus. Natus
                            sunt nobis ex distinctio voluptatem deserunt eveniet
                            cumque fuga!
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae impedit eaque culpa qui ad
                            provident et earum inventore ab accusamus. Natus
                            sunt nobis ex distinctio voluptatem deserunt eveniet
                            cumque fuga!
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <img
                            src="https://images.pexels.com/photos/19155212/pexels-photo-19155212/free-photo-of-roof-on-a-yellow-building.jpeg"
                            alt=""
                        />
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae impedit eaque culpa qui ad
                            provident et earum inventore ab accusamus. Natus
                            sunt nobis ex distinctio voluptatem deserunt eveniet
                            cumque fuga!
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae impedit eaque culpa qui ad
                            provident et earum inventore ab accusamus. Natus
                            sunt nobis ex distinctio voluptatem deserunt eveniet
                            cumque fuga!
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae impedit eaque culpa qui ad
                            provident et earum inventore ab accusamus. Natus
                            sunt nobis ex distinctio voluptatem deserunt eveniet
                            cumque fuga!
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
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
                <button className="sendButton">Send</button>
            </div>
        </div>
    )
}

export default Chat
