import './chat.css'
import { toast } from 'react-toastify'
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
import { format } from 'timeago.js'

const Chat = () => {
    const [image, setImage] = useState({
        file: null,
        url: '',
    })
    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')
    const [chat, setChat] = useState(null)
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji)
    }
    const endRef = useRef()
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
    const { currentUser } = useUserStore()
    const {
        chatId,
        user,
        isCurrentUserBlocked,
        isReceiverBlocked,
        details,
        detailsToggle,
    } = useChatStore()

    const handleImage = (e) => {
        if (
            e.target.files[0] &&
            allowedTypes.includes(e.target.files[0].type)
        ) {
            setImage({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        } else {
            toast.error('Only png, jpg, and jpeg file formats are allowed')
        }
    }

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
        // the chat object is mentioned as a dependency because we need to check for changes in that chats, only then
        // do we need to scroll.
    }, [chat])

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'chats', chatId), (res) => {
            setChat(res.data())
        })
        return () => {
            unsub()
        }
    }, [chatId])

    const handleSend = async () => {
        if (text === '' && image.url === '') return
        console.log('Send called!')

        let imageUrl = null
        try {
            if (image.file) {
                imageUrl = await upload(image.file)
            }
            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    createdAt: new Date(),
                    ...(text && { text: text }),
                    ...(imageUrl && { img: imageUrl }),
                }),
            })

            const userIds = [currentUser.id, user.id]

            userIds.forEach(async (id) => {
                const userChatsRef = doc(db, 'userChats', id)
                const userChatsSnapshot = await getDoc(userChatsRef)

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId == chatId
                    )

                    userChatsData.chats[chatIndex].lastMessage = text
                        ? text
                        : image.file.name
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id ? true : false
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }

        setImage({
            file: null,
            url: '',
        })

        setText('')
    }

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || './avatar.png'} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>{user?.caption}</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img
                        src="./info.png"
                        alt=""
                        onClick={() => detailsToggle()}
                    />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message) => (
                    <div
                        className={
                            message.senderId == currentUser.id
                                ? 'message own'
                                : 'message'
                        }
                        key={message.createdAt}
                    >
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            {message.text && <p>{message.text}</p>}
                            <span>{format(message.createdAt.toDate())}</span>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            {image.url && (
                <div
                    className="imageToSend"
                    style={{
                        width: details ? '475px' : '730px',
                        right: details ? '535px' : '152px',
                    }}
                >
                    <img
                        src="./close.svg"
                        alt=""
                        className="closeMark"
                        onClick={() =>
                            setImage({
                                file: null,
                                url: '',
                            })
                        }
                    />
                    <div className="texts">
                        <img
                            src={image.url}
                            style={{
                                width: details ? '465px' : '720px',
                            }}
                            alt=""
                        />
                    </div>
                </div>
            )}
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        style={{ display: 'none' }}
                        onChange={handleImage}
                    />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()

                        setImage({
                            file: null,
                            url: '',
                        })

                        setText('')
                    }}
                >
                    <input
                        className={image.url ? 'imageTextBox' : 'textBox'}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={
                            isCurrentUserBlocked || isReceiverBlocked
                                ? 'You cannot send a message'
                                : 'Type a message..'
                        }
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    />
                    <div className="emoji">
                        <img
                            src="./emoji.png"
                            alt=""
                            onClick={() => setOpen((prev) => !prev)}
                        />
                        <div className="picker">
                            <EmojiPicker
                                open={open}
                                onEmojiClick={handleEmoji}
                            />
                        </div>
                    </div>
                    <input
                        type="submit"
                        className="sendButton"
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                        value="Send"
                    />
                </form>
            </div>
        </div>
    )
}

export default Chat
