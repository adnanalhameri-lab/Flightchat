// Chat Page - Main application page

'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'
import { ChatInterface } from '@/components/ChatInterface'

export default function ChatPage() {
  const { currentConversationId, createConversation } = useChatStore()

  // Create initial conversation if none exists
  useEffect(() => {
    if (!currentConversationId) {
      createConversation()
    }
  }, [currentConversationId, createConversation])

  return <ChatInterface />
}
