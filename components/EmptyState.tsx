// Empty State Component - Show before first message

'use client'

import { Plane } from 'lucide-react'

interface EmptyStateProps {
  onExampleClick?: (example: string) => void
}

export function EmptyState({ onExampleClick }: EmptyStateProps) {
  const examples = [
    'Znajdź najtańsze loty z Warszawy w maju',
    'Chcę polecieć do Barcelony za max 500 PLN',
    'Pokaż loty na ciepłe miejsce w marcu, maks 7 dni',
    'Szukam lotów z Polski do Włoch w czerwcu',
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-8 py-16 text-center">
      {/* Icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        <div className="relative bg-primary/10 p-8 rounded-full">
          <Plane className="w-16 h-16 text-primary" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-text mb-4">
        Gdzie polecimy dzisiaj?
      </h1>

      {/* Description */}
      <p className="text-lg text-text-secondary mb-12 max-w-lg">
        Jestem Twoim AI asystentem podróży. Powiedz mi czego szukasz, a znajdę dla Ciebie najlepsze loty wraz z atrakcjami, pogodą i transportem.
      </p>

      {/* Example queries */}
      <div className="w-full max-w-2xl">
        <p className="text-sm text-text-secondary mb-4 font-medium">
          Przykładowe zapytania:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => onExampleClick?.(example)}
              className="p-4 text-left text-sm border border-border bg-surface hover:bg-primary/5 hover:border-primary/30 rounded-lg transition-all duration-200 group"
            >
              <span className="text-text-secondary group-hover:text-primary transition-colors">
                {example}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
