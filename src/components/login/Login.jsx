import './login.css'
import { toast } from 'react-toastify'
import { useState } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import upload from '../../lib/uploads.js'
import { doc, setDoc } from 'firebase/firestore'

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: '',
    })

    const [loading, setLoading] = useState(false)

    const acceptingTypes = ['image/png', 'image/jpg', 'image/jpeg']

    const handleAvatar = (e) => {
        if (
            e.target.files[0] &&
            acceptingTypes.includes(e.target.files[0].type)
        ) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        } else toast.error('Only png, jpg, and jpeg file formats are allowed!')
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        const { email, password } = Object.fromEntries(formData)

        if (!email || !password) {
            setLoading(false)
            toast.warn('Please enter both email and password')
        } else if (
            !email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
            setLoading(false)
            toast.warn('Please enter a valid email address!')
        }

        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const imgUrl = await upload(avatar.file)

        const { username, email, password, confirmPassword } =
            Object.fromEntries(formData)

        if (!username || !email || !password || !confirmPassword || !imgUrl) {
            setLoading(false)
            return toast.warn('Please enter inputs!')
        } else if (
            !email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
            setLoading(false)
            return toast.warn('Please enter a valid email address')
        } else if (password !== confirmPassword) {
            setLoading(false)

            return toast.warn(
                'Please make sure password and confirm password are same!'
            )
        }

        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            await setDoc(doc(db, 'users', res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
                caption: 'Hi there!',
            })

            await setDoc(doc(db, 'userChats', res.user.uid), {
                chats: [],
            })

            toast.success('Account created! You can login now!')
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" name="email" placeholder="Email" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                    />

                    <button disabled={loading}>
                        {loading ? 'Loading' : 'Sign In'}
                    </button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || './avatar.png'} alt="" />
                        Upload an image
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: 'none' }}
                        onChange={handleAvatar}
                    />
                    <input type="text" name="username" placeholder="Username" />
                    <input type="email" name="email" placeholder="Email" />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                    />
                    <button disabled={loading}>
                        {loading ? 'Loading' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
