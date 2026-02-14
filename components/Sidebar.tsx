// Sidebar Component - Conversation list and navigation

'use client'

import { useState, useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  MessageSquarePlus,
  Trash2,
  Menu,
  X,
  Plane,
  Settings,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'

export function Sidebar() {
  const { user } = useUser()
  const {
    conversations,
    currentConversationId,
    hasHydrated,
    createConversation,
    setCurrentConversation,
    deleteConversation,
  } = useChatStore()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewChat = () => {
    const id = createConversation()
    setCurrentConversation(id)
    setIsOpen(false)
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id)
    setIsOpen(false)
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Czy na pewno chcesz usunąć tę rozmowę?')) {
      deleteConversation(id)
    }
  }

  // Group conversations by date - only on client to avoid hydration mismatch
  const [groupedConversations, setGroupedConversations] = useState<Record<string, typeof conversations>>({})
  
  useEffect(() => {
    if (!mounted || !hasHydrated) return
    
    const groups = conversations.reduce((acc, conv) => {
      const now = new Date()
      const convDate = new Date(conv.updatedAt)
      const diffDays = Math.floor((now.getTime() - convDate.getTime()) / (1000 * 60 * 60 * 24))

      let group = 'Starsze'
      if (diffDays === 0) group = 'Dzisiaj'
      else if (diffDays === 1) group = 'Wczoraj'
      else if (diffDays <= 7) group = 'Ostatnie 7 dni'
      else if (diffDays <= 30) group = 'Ostatni miesiąc'

      if (!acc[group]) acc[group] = []
      acc[group].push(conv)
      return acc
    }, {} as Record<string, typeof conversations>)
    
    setGroupedConversations(groups)
  }, [conversations, mounted, hasHydrated])

  const groupOrder = ['Dzisiaj', 'Wczoraj', 'Ostatnie 7 dni', 'Ostatni miesiąc', 'Starsze']

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-80 bg-surface border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plane className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">FlightChat</h1>
              <p className="text-xs text-text-secondary">AI Travel Assistant</p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all font-medium shadow-sm"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Nowa rozmowa
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-secondary">
                Brak rozmów. Rozpocznij nową konwersację!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupOrder.map((group) => {
                const groupConvs = groupedConversations[group]
                if (!groupConvs || groupConvs.length === 0) return null

                return (
                  <div key={group}>
                    <h3 className="text-xs font-semibold text-text-secondary uppercase mb-2 px-2">
                      {group}
                    </h3>
                    <div className="space-y-1">
                      {groupConvs.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv.id)}
                          className={`
                            group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
                            ${
                              conv.id === currentConversationId
                                ? 'bg-primary/10 border border-primary/30'
                                : 'hover:bg-background border border-transparent'
                            }
                          `}
                        >
                          <ChevronRight
                            className={`w-4 h-4 flex-shrink-0 transition-transform ${
                              conv.id === currentConversationId ? 'text-primary' : 'text-text-secondary'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text truncate">
                              {conv.title}
                            </p>
                            <p className="text-xs text-text-secondary" suppressHydrationWarning>
                              {conv.messages.length} wiadomości •{' '}
                              {mounted ? formatDistanceToNow(new Date(conv.updatedAt), {
                                addSuffix: true,
                                locale: pl,
                              }) : '...'}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 rounded transition-all"
                            title="Usuń rozmowę"
                          >
                            <Trash2 className="w-4 h-4 text-error" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer - User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <UserButton afterSignOutUrl="/sign-in" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-xs text-success">Pro • Active</p>
              </div>
            </div>
            <Link
              href="/settings"
              className="p-2 hover:bg-background rounded-lg transition-colors"
              title="Ustawienia"
            >
              <Settings className="w-4 h-4 text-text-secondary" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  )
}
