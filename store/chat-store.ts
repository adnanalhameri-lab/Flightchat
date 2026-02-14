// Zustand Store for Chat State Management

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Conversation, Message } from '@/lib/types'
import { nanoid } from 'nanoid'

interface ChatStore {
  // State
  conversations: Conversation[]
  currentConversationId: string | null
  hasHydrated: boolean

  // Actions
  createConversation: () => string
  setCurrentConversation: (id: string) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateConversationTitle: (id: string, title: string) => void
  deleteConversation: (id: string) => void
  clearAll: () => void
  getCurrentConversation: () => Conversation | null
  setHasHydrated: (value: boolean) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      conversations: [],
      currentConversationId: null,
      hasHydrated: false,

      // Create a new conversation
      createConversation: () => {
        const id = nanoid()
        const newConversation: Conversation = {
          id,
          userId: '', // Will be set from Clerk
          title: 'Nowa rozmowa',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }))

        return id
      },

      // Set current conversation
      setCurrentConversation: (id) => {
        set({ currentConversationId: id })
      },

      // Add message to conversation
      addMessage: (conversationId, message) => {
        const fullMessage: Message = {
          ...message,
          id: nanoid(),
          timestamp: new Date(),
        }

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, fullMessage],
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      // Update conversation title (auto-generated from first message)
      updateConversationTitle: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? {
                  ...conv,
                  title: title.slice(0, 50), // Limit title length
                  updatedAt: new Date(),
                }
              : conv
          ),
        }))
      },

      // Delete conversation
      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId:
            state.currentConversationId === id ? null : state.currentConversationId,
        }))
      },

      // Clear all conversations
      clearAll: () => {
        set({
          conversations: [],
          currentConversationId: null,
        })
      },

      // Get current conversation
      getCurrentConversation: () => {
        const state = get()
        return state.conversations.find((conv) => conv.id === state.currentConversationId) || null
      },

      // Set hydrated state
      setHasHydrated: (value: boolean) => {
        set({ hasHydrated: value })
      },
    }),
    {
      name: 'flightchat-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        conversations: state.conversations.slice(0, 50), // Limit to 50 most recent
        currentConversationId: state.currentConversationId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true)
        }
      },
      skipHydration: false,
    }
  )
)
