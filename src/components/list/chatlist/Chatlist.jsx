import './chatlist.css'
import AddUser from './addUser/AddUser.jsx'
import { useState, useEffect } from 'react'
import { useUserStore } from '../../../lib/userStore.js'
import { useChatStore } from '../../../lib/chatStore.js'
import { onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase.js'

const Chatlist = () => {
    const [addMode, setAddMode] = useState(false)
    const [chats, setChats] = useState([])
    const [input, setInput] = useState('')
    const { currentUser } = useUserStore()
    const { chatId, changeChat } = useChatStore()

    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, 'userChats', currentUser.id),
            async (res) => {
                const items = res.data().chats

                const promises = items.map(async (item) => {
                    const userDocRef = doc(db, 'users', item.receiverId)
                    const userDocSnap = await getDoc(userDocRef)

                    const user = userDocSnap.data()

                    return { ...item, user }
                })

                const chatData = await Promise.all(promises)

                setChats(chatData.sort((a, b) => b.updateAt - a.updateAt))
            }
        )
        return () => {
            unsub()
        }
    }, [currentUser.id])

    const handleSelect = async (chat) => {
        const userChats = chats.map((chat) => {
            const { user, ...rest } = chat

            return rest
        })

        const chatIndex = userChats.findIndex(
            (item) => item.chatId == chat.chatId
        )

        userChats[chatIndex].isSeen = true

        const userChatsRef = doc(db, 'userChats', currentUser.id)

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            })
            changeChat(chat.chatId, chat.user)
        } catch (error) {
            console.log(error)
        }
    }

    const filteredChats = chats.filter((c) =>
        c.user.username.toLowerCase().includes(input.toLowerCase())
    )

    return (
        <div className="chatlist">
            <div className="search">
                <div className="searchbar">
                    <img src="./search.png" alt="" />
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <img
                    src={addMode ? './minus.png' : './plus.png'}
                    onClick={() => setAddMode((prev) => !prev)}
                    className="add"
                />
            </div>
            {filteredChats.map((chat) => {
                return (
                    <div
                        className="item"
                        key={chat.chatId}
                        onClick={() => handleSelect(chat)}
                        style={{
                            backgroundColor: chat?.isSeen
                                ? 'transparent'
                                : '#5183fe',
                        }}
                    >
                        <img
                            src={
                                chat.user.blocked.includes(currentUser.id)
                                    ? './avatar.png'
                                    : chat.user.avatar || './avatar.png'
                            }
                        />
                        <div className="texts">
                            <span>
                                {chat.user.blocked.includes(currentUser.id)
                                    ? 'User'
                                    : chat.user.username}
                            </span>
                            <p>{chat.lastMessage}</p>
                        </div>
                    </div>
                )
            })}
            {addMode && <AddUser chats={chats} setAddMode={setAddMode} />}
        </div>
    )
}

export default Chatlist
