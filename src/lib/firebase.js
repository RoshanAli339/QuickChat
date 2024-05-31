import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: 'mychat-f1065.firebaseapp.com',
    projectId: 'mychat-f1065',
    storageBucket: 'mychat-f1065.appspot.com',
    messagingSenderId: '503625873226',
    appId: '1:503625873226:web:9f02693f9268c15c76b3b3',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
