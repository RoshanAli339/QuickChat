import './detail.css'
import { db, storage } from '../../lib/firebase.js'
import { useChatStore } from '../../lib/chatStore.js'
import { useUserStore } from '../../lib/userStore.js'
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    onSnapshot,
} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { getDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'

const Detail = () => {
    const [images, setImages] = useState([])
    const [settingsToggle, setSettingsToggle] = useState(false)
    const [photosToggle, setPhotosToggle] = useState(false)
    const [filesToggle, setFilesToggle] = useState(false)

    const {
        chatId,
        user,
        isCurrentUserBlocked,
        isReceiverBlocked,
        changeBlock,
    } = useChatStore()
    const { currentUser } = useUserStore()

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'chats', chatId), (res) => {
            const urls = res
                .data()
                .messages.filter((c) => {
                    return c.img
                })
                .map((c) => c.img)
            setImages(urls)
        })
        return () => {
            unsub()
        }
    }, [chatId])

    const handleBlock = async () => {
        if (!user) return

        const userDocRef = doc(db, 'users', currentUser.id)

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked
                    ? arrayRemove(user.id)
                    : arrayUnion(user.id),
            })
            changeBlock()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClearchat = async () => {
        try {
            await updateDoc(doc(db, 'chats', chatId), {
                messages: [],
            })
            images.map(async (img) => {
                const fileRef = ref(
                    storage,
                    decodeURIComponent(new URL(img).pathname.slice(33))
                )
                try {
                    await deleteObject(fileRef)
                } catch (err) {
                    console.log(err)
                }
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

                    userChatsData.chats[chatIndex].lastMessage = ''
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
    }

    const handleImageDownload = (e, url) => {
        e.stopPropagation()
        var ele = document.createElement('a')
        var file = new Blob([url, { type: 'image/*' }])
        ele.href = URL.createObjectURL(file)
        ele.download = decodeURIComponent(new URL(url).pathname.slice(39))
        ele.click()
    }

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || './avatar.png'} alt="" />
                <h2>{user?.username}</h2>
                <p>{user?.caption}</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img
                            src={
                                photosToggle
                                    ? './arrowUp.png'
                                    : './arrowDown.png'
                            }
                            alt=""
                            onClick={() => setPhotosToggle((prev) => !prev)}
                        />
                    </div>
                    {photosToggle && (
                        <div className="content">
                            {images.map((image) => (
                                <div className="item" key={image}>
                                    <div className="itemDetail">
                                        <img src={image} />
                                        <span>photo_2024_5_30.png</span>
                                    </div>
                                    <img
                                        src="./download.png"
                                        alt=""
                                        className="icon"
                                        onClick={(e) =>
                                            handleImageDownload(e, image)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img
                            src={
                                settingsToggle
                                    ? './arrowUp.png'
                                    : './arrowDown.png'
                            }
                            alt=""
                            onClick={() => setSettingsToggle((prev) => !prev)}
                        />
                    </div>
                    {settingsToggle && (
                        <div className="content">
                            <button onClick={handleBlock}>
                                {isCurrentUserBlocked
                                    ? 'You are blocked'
                                    : isReceiverBlocked
                                      ? 'User blocked! Click to unblock'
                                      : 'Block user'}
                            </button>
                            <button
                                className="clearchat"
                                onClick={handleClearchat}
                            >
                                Clear chat
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Detail
