import './edituser.css'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { auth, db, storage } from '../../../../lib/firebase.js'
import { updateEmail, updatePassword } from 'firebase/auth'
import { useUserStore } from '../../../../lib/userStore.js'
import { useChatStore } from '../../../../lib/chatStore.js'
import upload from '../../../../lib/uploads.js'

const EditUser = ({ setEditMode }) => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: '',
    })
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [caption, setCaption] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const acceptingTypes = ['image/png', 'image/jpg', 'image/jpeg']

    const { currentUser } = useUserStore()
    const { resetChat } = useChatStore()

    const handleAvatar = (e) => {
        if (
            e.target.files[0] &&
            acceptingTypes.includes(e.target.files[0].type)
        ) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        } else {
            toast.error('Only png, jpg, and jpeg file formats are allowed')
        }
    }

    const handleUpdateAvatar = async () => {
        if (!avatar.url) return toast.warn('Select an image')
        const fileRef = ref(
            storage,
            decodeURIComponent(new URL(currentUser.avatar).pathname.slice(33))
        )
        const imgUrl = await upload(avatar.file)

        try {
            await updateDoc(doc(db, 'users', currentUser.id), {
                avatar: imgUrl,
            })
            await deleteObject(fileRef)

            toast.success('Avatar updated successfully')
            setAvatar({
                file: null,
                url: '',
            })
        } catch (error) {
            toast.error('Error updating avatar')
            console.log(error)
        }
    }

    const handleUpdateUsername = async () => {
        if (!username)
            return toast.warn('Please enter username before submitting')

        try {
            await updateDoc(doc(db, 'users', currentUser.id), {
                username: username,
            })
            toast.success('Username updated successfully')
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateEmail = async () => {
        if (!email)
            return toast.warn(
                'Please enter valid email address before submitting'
            )

        try {
            await updateEmail(auth.currentUser, email)
            await updateDoc(doc(db, 'users', currentUser.id), {
                email: email,
            })
            toast.success('Email updated successfully')
            toast.info('You will be logged out shortly')
            setTimeout(() => {
                auth.signOut()
                resetChat()
            }, 5000)
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdateCaption = async () => {
        if (!caption) toast.warn('Please enter the caption before submitting')

        try {
            await updateDoc(doc(db, 'users', currentUser.id), {
                caption: caption,
            })
            toast.success('Caption updated successfully')
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdatePassword = async () => {
        if (!password || !confirmPassword)
            toast.warn('Please enter both fields before submitting')
        else if (password !== confirmPassword)
            toast.warn(
                'Please make sure both fields are same before submitting'
            )

        try {
            await updatePassword(auth.currentUser, password)
            toast.success('Password updated successfully')
            toast.info('You will be logged out shortly')
            setTimeout(() => {
                auth.signOut()
                resetChat()
            }, 5000)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="editUser">
            <div className="editTitle">
                <h2>Edit user details!</h2>
                <img
                    src="./close.svg"
                    alt=""
                    onClick={() => setEditMode(false)}
                />
            </div>
            <div className="form">
                <div className="changeItem">
                    <label htmlFor="file">
                        <img src={avatar?.url || './avatar.png'} alt="" />
                        Upload an image
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: 'none' }}
                        onChange={handleAvatar}
                    />
                    <button onClick={handleUpdateAvatar}>Update</button>
                </div>
                <div className="changeItem">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleUpdateEmail}>Update</button>
                </div>
                <div className="changeItem">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleUpdateUsername}>Update</button>
                </div>
                <div className="changeItem">
                    <input
                        type="text"
                        name="caption"
                        placeholder="Caption"
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <button onClick={handleUpdateCaption}>Update</button>
                </div>
                <div className="changeItem">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button onClick={handleUpdatePassword}>Update</button>
                </div>
            </div>
        </div>
    )
}

export default EditUser
