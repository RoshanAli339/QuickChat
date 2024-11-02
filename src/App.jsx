import List from './components/list/List.jsx'
import Chat from './components/chat/Chat.jsx'
import Detail from './components/detail/Detial.jsx'
import Login from './components/login/Login.jsx'
import Notification from './components/notification/Notification.jsx'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase.js'
import { useUserStore } from './lib/userStore.js'
import { useChatStore } from './lib/chatStore.js'

const App = () => {
    /**
     * This is the main component that renders all other components
     * The details of the currentUser logged in is fetched from the UserStore state management store.
     * The details of the chat currently selected are fetched from the ChatStore state management store.
     * 
     * If not logged in the Login component will be loaded
     */
    const { currentUser, isLoading, fetchUserInfo } = useUserStore()
    const { chatId, details } = useChatStore()

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid)
        })

        return () => {
            unSub()
        }
    }, [fetchUserInfo])

    if (isLoading) return <div className="loading">Loading!</div>

    return (
        <div className="container">
            {currentUser ? (
                <>
                    <List />
                    {chatId && <Chat />}
                    {chatId && details && <Detail />}
                </>
            ) : (
                <Login />
            )}
            <Notification />
        </div>
    )
}

export default App
