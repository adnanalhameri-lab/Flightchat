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
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-blue-200 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}
      >
        {/* Header with Gradient */}
        <div className="relative overflow-hidden border-b border-blue-200">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-orange-500 opacity-100" />
          
          {/* Content */}
          <div className="relative p-4">
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Plane className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow">FlightChat</h1>
                <p className="text-xs text-white/90">AI Travel Assistant</p>
              </div>
            </div>

            {/* New Chat Button */}
            <motion.button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-white/90 text-blue-600 rounded-lg transition-all font-semibold shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageSquarePlus className="w-4 h-4" />
              Nowa rozmowa
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-blue-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Szukaj rozmów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-blue-50/50 border border-blue-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600">
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
                      className="w-full flex items-center justify-between text-xs font-semibold text-gray-600 uppercase mb-2 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
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
                              className={`group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${conv.id === currentConversationId ? 'bg-blue-50 border border-blue-200' : 'hover:bg-blue-50/50 border border-transparent'}`}
                              whileHover={{ x: 4 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              <ChevronRight
                                className={`w-4 h-4 flex-shrink-0 transition-transform ${
                                  conv.id === currentConversationId ? 'text-blue-600' : 'text-gray-600'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {conv.title}
                                </p>
                                <p className="text-xs text-gray-600" suppressHydrationWarning>
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

        {/* Stats Section */}
        <div className="px-4 py-3 border-t border-blue-200 bg-blue-50/30">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100">
              <MessageSquare className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-blue-600">{stats.conversations}</p>
              <p className="text-xs text-gray-600">Rozmowy</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-50 border border-orange-100">
              <Heart className="w-4 h-4 text-orange-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-orange-600">{stats.favorites}</p>
              <p className="text-xs text-gray-600">Ulubione</p>
            </div>
            <div className="p-2 rounded-lg bg-green-50 border border-green-100">
              <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-green-600">{stats.messages}</p>
              <p className="text-xs text-gray-600">Wiadomości</p>
            </div>
          </div>
        </div>

        {/* Footer - User */}
        <div className="p-4 border-t border-blue-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <UserButton afterSignOutUrl="/sign-in" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>
                <p className="text-xs text-success">Pro • Active</p>
              </div>
            </div>
            <Link
              href="/settings"
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Ustawienia"
            >
              <Settings className="w-4 h-4 text-gray-600" />
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
