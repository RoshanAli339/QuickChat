import './userinfo.css'
import { useUserStore } from '../../../lib/userStore.js'
import { useChatStore } from '../../../lib/chatStore.js'
import { auth } from '../../../lib/firebase.js'
import { useState } from 'react'
import EditUser from './editUser/EditUser.jsx'

const Userinfo = () => {
    const [editMode, setEditMode] = useState(false)
    const { currentUser } = useUserStore()
    const { resetChat } = useChatStore()
    const handleLogout = () => {
        auth.signOut()
        resetChat()
    }
    return (
        <div className="userinfo">
            <div className="user">
                <img src={currentUser.avatar || './avatar.png'} />
                <div className="username">
                    <h2>{currentUser.username}</h2>
                    <p>{currentUser.caption}</p>
                </div>
            </div>
            <div className="icons">
                <img src="./logout.svg" alt="" onClick={handleLogout} />
                <img
                    src="./edit.png"
                    alt=""
                    onClick={() => setEditMode((prev) => !prev)}
                />
            </div>
            {editMode && <EditUser setEditMode={setEditMode} />}
        </div>
    )
}

export default Userinfo
