import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useUserStore } from './userStore.js'

export const useChatStore = create(
    persist(
        (set) => ({
            chatId: null,
            user: null,
            isCurrentUserBlocked: false,
            isReceiverBlocked: false,
            details: false,
            changeChat: (chatId, user) => {
                const currentUser = useUserStore.getState().currentUser

                // CHECK IF CURRENT USER IS BLOCKED
                if (user.blocked.includes(currentUser.id)) {
                    return set({
                        chatId,
                        user: null,
                        isCurrentUserBlocked: true,
                        isReceiverBlocked: false,
                    })
                }
                // CHECK IF CURRENT USER IS BLOCKED
                else if (currentUser.blocked.includes(user.id)) {
                    return set({
                        chatId,
                        user: user,
                        isCurrentUserBlocked: false,
                        isReceiverBlocked: true,
                    })
                } else {
                    return set({
                        chatId,
                        user: user,
                        isCurrentUserBlocked: false,
                        isReceiverBlocked: false,
                    })
                }
            },
            changeBlock: () => {
                set((state) => ({
                    ...state,
                    isReceiverBlocked: !state.isReceiverBlocked,
                }))
            },
            resetChat: () => {
                set({
                    chatId: null,
                    user: null,
                    isCurrentUserBlocked: false,
                    isReceiverBlocked: false,
                })
            },
            detailsToggle: () => {
                set((state) => ({
                    ...state,
                    details: !state.details,
                }))
            },
        }),
        {
            name: 'chat store',
        }
    )
)
