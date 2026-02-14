// Chat Message Component - Display user and assistant messages

'use client'

import { useState, useEffect } from 'react'
import { Message } from '@/lib/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ComparisonView } from './ComparisonView'
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
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-slide-in-bottom`}>
      {/* Avatar - left for assistant */}
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-5 py-3 ${
            isUser
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-surface border border-border text-text rounded-bl-sm'
          }`}
        >
          {isUser ? (
            // User message - plain text
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            // Assistant message - Markdown
            <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                // Custom styling for markdown elements
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="mb-3 list-disc pl-5 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-3 list-decimal pl-5 space-y-1">{children}</ol>,
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2 first:mt-0">{children}</h3>,
                strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 bg-border rounded text-sm font-mono">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-background border border-border rounded-lg p-3 overflow-x-auto my-2">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-2 text-text-secondary">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Destination Cards */}
        {message.destinations && message.destinations.length > 0 && (
          <div className="w-full mt-4">
            <ComparisonView destinations={message.destinations} />
          </div>
        )}

        {/* Timestamp - client only to avoid hydration mismatch */}
        <p className="text-xs text-text-secondary mt-1 px-2" suppressHydrationWarning>
          {mounted ? new Date(message.timestamp).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
          }) : '--:--'}
        </p>
      </div>

      {/* Avatar - right for user */}
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
          <User className="w-5 h-5 text-accent" />
        </div>
      )}
    </div>
  )
}
