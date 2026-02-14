// Chat Input Component - Message input with auto-resize

'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Gdzie chcesz polecieć? Opisz swoje wymarzone wakacje...',
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [message])

  const handleSubmit = () => {
    const trimmed = message.trim()
    if (!trimmed || disabled) return

    onSend(trimmed)
    setMessage('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-surface p-4">
      <div className="max-w-4xl mx-auto flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 pr-12 text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ maxHeight: '200px' }}
          />
          
          <button
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Wyślij (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-xs text-text-secondary text-center mt-2">
        <kbd className="px-1.5 py-0.5 bg-border rounded text-xs">Enter</kbd> aby wysłać,{' '}
        <kbd className="px-1.5 py-0.5 bg-border rounded text-xs">Shift+Enter</kbd> dla nowej linii
      </p>
    </div>
  )
}
