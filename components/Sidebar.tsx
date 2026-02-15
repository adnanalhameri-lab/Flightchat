// Sidebar Component - Conversation list and navigation

'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Search,
  MessageSquare,
  Heart,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'

export function Sidebar() {
  const router = useRouter()
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
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(['Starsze']))
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [activeView, setActiveView] = useState<'messages' | 'conversations'>('conversations')
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewChat = () => {
    const id = createConversation()
    setCurrentConversation(id)
    setIsOpen(false)
    router.push('/chat')
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id)
    setIsOpen(false)
    router.push('/chat')
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Czy na pewno chcesz usunąć tę rozmowę?')) {
      deleteConversation(id)
    }
  }

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations
    
    const query = searchQuery.toLowerCase()
    return conversations.filter(conv => 
      conv.title.toLowerCase().includes(query) ||
      conv.messages.some(msg => 
        msg.content.toLowerCase().includes(query)
      )
    )
  }, [conversations, searchQuery])

  // Group conversations by date - only on client to avoid hydration mismatch
  const [groupedConversations, setGroupedConversations] = useState<Record<string, typeof conversations>>({})
  
  useEffect(() => {
    if (!mounted || !hasHydrated) return
    
    const groups = filteredConversations.reduce((acc, conv) => {
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
  }, [filteredConversations, mounted, hasHydrated])

  const groupOrder = ['Dzisiaj', 'Wczoraj', 'Ostatnie 7 dni', 'Ostatni miesiąc', 'Starsze']

  // Calculate stats
  const stats = useMemo(() => {
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0)
    const favorites = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('flightchat_favorites') || '[]').length 
      : 0
    
    return {
      conversations: conversations.length,
      messages: totalMessages,
      favorites,
    }
  }, [conversations])

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-blue-200 rounded-lg shadow-lg hover:bg-blue-50 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-500 rounded-xl">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">FlightChat</h1>
              <p className="text-xs text-gray-500">AI Travel Assistant</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveView('messages')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeView === 'messages'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Wiadomości
            </button>
            <button
              onClick={() => setActiveView('conversations')}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeView === 'conversations'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              Rozmowy
            </button>
          </div>

          {/* New Chat Button */}
          <motion.button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 font-semibold cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageSquarePlus className="w-4 h-4" />
            Nowa rozmowa
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj rozmów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {showFavoritesOnly ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">Brak ulubionych rozmów</p>
              <p className="text-xs text-gray-400 mb-4">Funkcja ulubionych rozmów będzie dostępna wkrótce</p>
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-xl transition-all cursor-pointer"
              >
                Pokaż wszystkie
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Nie znaleziono rozmów' : 'Brak rozmów. Rozpocznij nową konwersację!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupOrder.map((group) => {
                const groupConvs = groupedConversations[group]
                if (!groupConvs || groupConvs.length === 0) return null
                
                const isCollapsed = collapsedGroups.has(group)

                return (
                  <div key={group}>
                    <button
                      onClick={() => toggleGroup(group)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase mb-2 px-2 py-1 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
                    >
                      <span>{group} ({groupConvs.length})</span>
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1 overflow-hidden"
                        >
                          {groupConvs.map((conv) => (
                            <motion.div
                              key={conv.id}
                              onClick={() => handleSelectConversation(conv.id)}
                              className={`group relative flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 ${conv.id === currentConversationId ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50 border border-transparent'}`}
                              whileHover={{ x: 2 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              <ChevronRight
                                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                  conv.id === currentConversationId ? 'text-orange-500' : 'text-gray-400'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  conv.id === currentConversationId ? 'text-orange-900' : 'text-gray-900'
                                }`}>
                                  {conv.title}
                                </p>
                                <p className="text-xs text-gray-500" suppressHydrationWarning>
                                  {conv.messages.length} wiadomości •{' '}
                                  {mounted ? formatDistanceToNow(new Date(conv.updatedAt), {
                                    addSuffix: true,
                                    locale: pl,
                                  }) : '...'}
                                </p>
                              </div>
                              <button
                                onClick={(e) => handleDeleteConversation(conv.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                title="Usuń rozmowę"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer - User */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <UserButton afterSignOutUrl="/sign-in" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-xs text-gray-500">FlightChat Pro</p>
              </div>
            </div>
            <Link
              href="/settings"
              className="p-2 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
              title="Ustawienia"
            >
              <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600" />
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
