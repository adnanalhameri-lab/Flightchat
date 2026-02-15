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
  const showSidebar = isLoading || (hasMessages && conversation.messages.some(m => m.destinations && m.destinations.length > 0))

  return (
    <div className="flex h-screen bg-white">
      {/* Main chat area */}
      <div className={`flex flex-col transition-all duration-300 ${showSidebar ? 'w-[60%]' : 'w-full'}`}>
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
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-300 shadow-md">
                      <Bot className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="bg-gray-100 px-6 py-4 rounded-2xl shadow-lg">
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

      {/* Right sidebar - Search progress & results */}
      {showSidebar && (
        <motion.div 
          className="w-[40%] bg-purple-50 border-l border-purple-200 overflow-y-auto p-6"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-purple-900 mb-4">Status wyszukiwania</h2>
            
            {/* Animated search steps */}
            {isLoading && (
              <div className="space-y-3">
                {[
                  { step: 1, text: 'Analizuję zapytanie...', icon: '🔍' },
                  { step: 2, text: 'Szukam najlepszych lotów...', icon: '✈️' },
                  { step: 3, text: 'Sprawdzam pogodę...', icon: '☀️' },
                  { step: 4, text: 'Zberam informacje o atrakcjach...', icon: '🎭' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.step}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-lg border border-purple-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <motion.span 
                      className="text-2xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {item.icon}
                    </motion.span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900">{item.text}</p>
                      <div className="w-full h-1 bg-purple-200 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Results summary */}
            {!isLoading && hasMessages && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="p-4 bg-white rounded-2xl shadow-lg border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-2">Znalezione wyniki</h3>
                  <p className="text-sm text-purple-700">
                    Przeanalizowano loty, pogodę i atrakcje dla wybranych destynacji.
                  </p>
                </div>
                
                {/* Destination count */}
                {conversation.messages.filter(m => m.destinations && m.destinations.length > 0).map((msg, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-900">
                      📍 {msg.destinations?.length || 0} {msg.destinations?.length === 1 ? 'destynacja' : 'destynacje'}
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      Sprawdź szczegóły poniżej w czacie
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
