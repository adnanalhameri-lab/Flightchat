// Chat Message Component - Modern pills with glassmorphism and animations

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Message } from '@/lib/types'
import { motionVariants } from '@/lib/design-tokens'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ComparisonView } from './ComparisonView'
import { CopyButton } from './CopyButton'
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div 
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial="hidden"
      animate="visible"
      variants={isUser ? motionVariants.messageUser : motionVariants.messageAssistant}
    >
      {/* Avatar - left for assistant */}
      {!isUser && (
        <motion.div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-300 shadow-md"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <Bot className="w-5 h-5 text-gray-700" />
        </motion.div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <motion.div
          className={`relative group ${
            isUser
              ? 'bg-orange-500 text-white rounded-2xl shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-900 rounded-2xl shadow-lg hover:shadow-xl'
          } px-6 py-4 transition-shadow duration-300`}
          whileHover={{ y: -2 }}
        >
          {/* Copy Button for assistant messages */}
          {!isUser && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CopyButton content={message.content} />
            </div>
          )}

          {isUser ? (
            // User message - plain text
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            // Assistant message - Markdown with enhanced styling
            <div className="prose prose-sm md:prose-base max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Paragraphs
                  p: ({ children }) => (
                    <p className="mb-4 last:mb-0 leading-relaxed text-gray-900 dark:text-text">
                      {children}
                    </p>
                  ),
                  
                  // Lists
                  ul: ({ children }) => (
                    <ul className="mb-4 space-y-2 pl-5">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 space-y-2 pl-5">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-900 dark:text-gray-900 leading-relaxed">
                      {children}
                    </li>
                  ),
                  
                  // Headings
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-3 mt-6 first:mt-0 text-blue-800 dark:text-blue-200">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0 text-blue-700 dark:text-blue-300">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0 text-blue-600 dark:text-blue-400">
                      {children}
                    </h3>
                  ),
                  
                  // Emphasis
                  strong: ({ children }) => (
                    <strong className="font-bold text-blue-800 dark:text-blue-200">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-600 dark:text-gray-600">
                      {children}
                    </em>
                  ),
                  
                  // Code
                  code: ({ children, className }) => {
                    const isInline = !className
                    if (isInline) {
                      return (
                        <code className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-sm font-mono border border-blue-100 dark:border-blue-800">
                          {children}
                        </code>
                      )
                    }
                    return <code className="font-mono">{children}</code>
                  },
                  pre: ({ children }) => (
                    <pre className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-xl p-4 overflow-x-auto my-4 shadow-sm">
                      {children}
                    </pre>
                  ),
                  
                  // Blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-400 pl-4 italic my-4 text-gray-600 dark:text-gray-600 bg-blue-50/50 dark:bg-blue-900/30 py-2 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  
                  // Links
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-600 transition-colors font-medium"
                    >
                      {children}
                    </a>
                  ),
                  
                  // Horizontal rule
                  hr: () => (
                    <hr className="my-6 border-t border-blue-200 dark:border-blue-800" />
                  ),
                  
                  // Tables
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-blue-200 dark:divide-blue-800 border border-blue-200 dark:border-blue-800 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 bg-blue-50 dark:bg-blue-900 text-left text-sm font-semibold text-blue-800 dark:text-blue-200">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border-t border-blue-100 dark:border-blue-800">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </motion.div>

        {/* Destination Cards */}
        {message.destinations && message.destinations.length > 0 && (
          <motion.div 
            className="w-full mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <ComparisonView destinations={message.destinations} />
          </motion.div>
        )}

        {/* Timestamp - client only to avoid hydration mismatch */}
        <motion.p 
          className="text-xs text-gray-400 mt-2 px-2"
          suppressHydrationWarning
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {mounted ? new Date(message.timestamp).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          }) : '--:--'}
        </motion.p>
      </div>

      {/* Avatar - right for user */}
      {isUser && (
        <motion.div 
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-500 shadow-md"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <User className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  )
}
