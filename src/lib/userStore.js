import { create } from 'zustand'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase.js'

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (uid) => {
        if (!uid) return set({ currentUser: null, isLoading: false })

        try {
            const docRef = doc(db, 'users', uid)
            onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    set({ currentUser: docSnap.data(), isLoading: false })
                } else {
                    set({ currentUser: null, isLoading: false })
                }
            })
        } catch (error) {
            console.log(error)
            return set({ currentUser: null, isLoading: false })
        }
    },
}))
