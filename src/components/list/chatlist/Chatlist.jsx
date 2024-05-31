import './chatlist.css'
import AddUser from './addUser/AddUser.jsx'
import { useState, useEffect } from 'react'
import { useUserStore } from '../../../lib/userStore.js'
import { useChatStore } from '../../../lib/chatStore.js'
import { onSnapshot, doc, getDoc } from 'firebase/firestore'
import { db } from '../../../lib/firebase.js'

const Chatlist = () => {
    const [addMode, setAddMode] = useState(false)
    const [chats, setChats] = useState([])
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
        changeChat(chat.chatId, chat.user)
    }

    return (
        <div className="chatlist">
            <div className="search">
                <div className="searchbar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img
                    src={addMode ? './minus.png' : './plus.png'}
                    onClick={() => setAddMode((prev) => !prev)}
                    className="add"
                />
            </div>
            {chats.map((chat) => (
                <div
                    className="item"
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                >
                    <img src={chat.user.avatar || './avatar.png'} />
                    <div className="texts">
                        <span>{chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addMode && <AddUser />}
        </div>
    )
}

export default Chatlist
