// Chat Interface Component - Main chat UI

'use client'

import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { EmptyState } from './EmptyState'
import { TypingIndicator } from './TypingIndicator'
import { Message, ChatApiResponse } from '@/lib/types'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export function ChatInterface() {
  const { getCurrentConversation, addMessage, updateConversationTitle, hasHydrated } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversation = getCurrentConversation()

  // ALL hooks must be at the top, before any conditional returns
  
  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  // Show loading state during SSR and initial hydration
  if (!mounted || !hasHydrated) {
    return (
      <div className="flex flex-col h-screen bg-transparent">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <ChatInput onSend={() => {}} disabled={true} />
      </div>
    )
  }

  const handleSendMessage = async (content: string) => {
    if (!conversation) return

    // Add user message
    addMessage(conversation.id, {
      role: 'user',
      content,
    })

    // Auto-generate title from first message
    if (conversation.messages.length === 0) {
      const title = content.slice(0, 50)
      updateConversationTitle(conversation.id, title)
    }

    // Start loading
    setIsLoading(true)

    try {
      // Non-streaming fetch
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...conversation.messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: 'user',
              content,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`)
      }

      // Parse JSON response
      const data: ChatApiResponse = await response.json()

      // Add assistant message with content and destinations
      addMessage(conversation.id, {
        role: 'assistant',
        content: data.content,
        destinations: data.destinations,
      })

    } catch (error) {
      console.error('Chat error:', error)
      addMessage(conversation.id, {
        role: 'assistant',
        content: 'Przepraszam, wystąpił błąd podczas przetwarzania Twojego zapytania. Spróbuj ponownie.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!conversation) {
    return (
      <div className="flex flex-col h-screen bg-transparent">
        <EmptyState />
      </div>
    )
  }

  const hasMessages = conversation.messages.length > 0

  return (
    <div className="flex flex-col h-screen bg-transparent">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {!hasMessages ? (
            <EmptyState onExampleClick={handleSendMessage} />
          ) : (
            <div className="space-y-6">
              {/* Existing messages */}
              {conversation.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div 
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="glass-strong px-6 py-4 rounded-3xl rounded-bl-md shadow-lg border border-white/20 dark:border-blue-800/30">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
}
