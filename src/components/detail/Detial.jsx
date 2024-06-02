import './detail.css'
import { auth, db } from '../../lib/firebase.js'
import { useChatStore } from '../../lib/chatStore.js'
import { useUserStore } from '../../lib/userStore.js'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

const Detail = () => {
    const {
        chatId,
        user,
        isCurrentUserBlocked,
        isReceiverBlocked,
        changeBlock,
    } = useChatStore()
    const { currentUser } = useUserStore()

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

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || './avatar.png'} alt="" />
                <h2>{user?.username}</h2>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                                <span>photo_2024_5_30.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                                <span>photo_2024_5_30.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://images.pexels.com/photos/19155212/pexels-photo-19155212/free-photo-of-roof-on-a-yellow-building.jpeg" />
                                <span>photo_2024_5_30.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://images.pexels.com/photos/7381200/pexels-photo-7381200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
                                <span>photo_2024_5_30.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked
                        ? 'You are blocked'
                        : isReceiverBlocked
                          ? 'User blocked'
                          : 'Block user'}
                </button>
                <button className="logout" onClick={() => auth.signOut()}>
                    Log out
                </button>
            </div>
        </div>
    )
}

export default Detail
