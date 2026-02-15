// Chat Interface Component - Main chat UI

'use client'

import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { EmptyState } from './EmptyState'
import { TypingIndicator } from './TypingIndicator'
import { FlightCard } from './FlightCard'
import { TripPlanCard } from './TripPlanCard'
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
  
  // Collect all destinations from messages for right panel
  const allDestinations = hasMessages 
    ? conversation.messages
        .filter(m => m.destinations && m.destinations.length > 0)
        .flatMap(m => m.destinations || [])
    : []

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main chat area */}
      <div className={`flex flex-col bg-white transition-all duration-300 ${showSidebar ? 'w-[60%]' : 'w-full'}`}>
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
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 border border-gray-200">
                      <Bot className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm">
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

        {/* Input area - hide when showing EmptyState (it has its own input) */}
        {hasMessages && <ChatInput onSend={handleSendMessage} disabled={isLoading} />}
      </div>

      {/* Right sidebar - Flight Cards & Trip Plans */}
      {showSidebar && (
        <motion.div 
          className="w-[40%] bg-gray-50 border-l border-gray-100 overflow-y-auto p-6"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Szukam dla Ciebie...</h2>
                <div className="space-y-3">
                  {[
                    { text: 'Analizuję zapytanie', icon: '🔍' },
                    { text: 'Szukam najlepszych lotów', icon: '✈️' },
                    { text: 'Sprawdzam dostępność', icon: '📅' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{item.text}</p>
                        <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <motion.div 
                            className="h-full bg-orange-500"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, ease: 'easeInOut' }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Flight Cards */}
            {!isLoading && allDestinations.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Znalezione loty
                  </h2>
                  <p className="text-sm text-gray-500">
                    {allDestinations.length} {allDestinations.length === 1 ? 'opcja' : 'opcje'}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {allDestinations.map((dest, index) => {
                    // Find lowest price for badge
                    const lowestPrice = Math.min(...allDestinations.map(d => d.flight.price))
                    const isLowest = dest.flight.price === lowestPrice
                    
                    return (
                      <FlightCard
                        key={index}
                        destination={dest}
                        isLowestPrice={isLowest}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
