// Claude AI Integration for FlightChat
// Option B: Non-streaming with prompt-based parameter extraction

import Anthropic from '@anthropic-ai/sdk'
import { FlightSearchParams } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const MODEL = 'claude-sonnet-4-5-20250929'

// ============================================
// NEW: Prompt-based extraction (Option B)
// ============================================

/**
 * Extract flight search parameters from user message using prompt-based approach
 * No tool-calling, just JSON extraction via prompt
 */
export async function extractSearchParamsPrompt(
  userMessage: string,
  conversationHistory: Anthropic.MessageParam[] = []
): Promise<FlightSearchParams | null> {
  const extractionPrompt = `Extract flight search parameters from the user's message.

Return ONLY a JSON object with these fields:
{
  "origin": "IATA code (WAW for Warsaw, KRK for Krakow, GDN for Gdansk) or null",
  "destination": "IATA code or null if not specified",
  "departureDate": "YYYY-MM-DD format or null",
  "returnDate": "YYYY-MM-DD format or null (optional)",
  "maxPrice": number or null,
  "maxDuration": number (days) or null,
  "preferences": "beach, culture, party, nature, romantic, etc. or null",
  "needsSearch": true/false - true only if user explicitly asks about flights/trips
}

Rules:
- Warsaw = WAW, Krakow = KRK, Gdansk = GDN
- For relative dates ("in May", "next week"), use current year 2025 and reasonable dates
- If user is just greeting/chatting, set needsSearch to false
- Respond ONLY with the JSON object, no other text`

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: extractionPrompt,
      messages: [
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ],
    })

    const textContent = response.content.find(b => b.type === 'text')?.text || '{}'
    
    try {
      const params = JSON.parse(textContent)
      
      if (!params.needsSearch) {
        return null
      }
      
      return {
        origin: params.origin || '',
        destination: params.destination || undefined,
        departureDate: params.departureDate || '',
        returnDate: params.returnDate || undefined,
        maxPrice: params.maxPrice || undefined,
        maxDuration: params.maxDuration || undefined,
        preferences: params.preferences || undefined,
        maxResults: 5,
      } as FlightSearchParams
    } catch (parseError) {
      console.error('Failed to parse extraction response:', textContent)
      return null
    }
  } catch (error) {
    console.error('Claude API error (extract params):', error)
    throw error
  }
}

/**
 * Format destinations data into a friendly response using Claude
 * Second call in the non-streaming flow
 */
export async function formatDestinationsResponsePrompt(
  userMessage: string,
  destinationsData: any,
  conversationHistory: Anthropic.MessageParam[] = []
): Promise<string> {
  const formattingPrompt = `You are FlightChat - an enthusiastic, warm travel AI assistant speaking Polish.

Create a friendly, helpful response presenting travel options.

Guidelines:
- Present 3-5 best options with clear comparison
- For each destination include: flight details, weather, top 3 attractions, transport from airport
- Add personal insight/recommendation for each option
- Clearly mark "best choice" with justification
- Use emojis and markdown formatting
- Be concise but informative
- ALWAYS respond in POLISH`

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: formattingPrompt,
      messages: [
        ...conversationHistory,
        {
          role: 'user',
          content: `Original query: "${userMessage}"\n\nSearch results:\n\n${JSON.stringify(destinationsData, null, 2)}`,
        },
      ],
    })

    const textContent = response.content.find(b => b.type === 'text')?.text
    
    if (textContent) {
      return textContent
    }

    return 'Znalazłem kilka opcji dla Ciebie! Sprawdź szczegóły poniżej.'
  } catch (error) {
    console.error('Claude API error (format response):', error)
    throw error
  }
}

/**
 * System prompt for FlightChat AI assistant
 * Using prompt caching to reduce costs (90% savings on repeated prompt)
 */
export const SYSTEM_PROMPT = `Jesteś FlightChat - entuzjastycznym, ciepłym asystentem podróży AI.
Pomagasz użytkownikom planować idealne podróże, łącząc informacje o lotach, atrakcjach, pogodzie i transporcie.

## TWOJE ZADANIA:

1. **Zrozumienie zapytania:** Wyciągnij parametry wyszukiwania z naturalnego języka
2. **Wywołanie narzędzia:** Użyj funkcji search_destinations z odpowiednimi parametrami
3. **Analiza wyników:** Przeanalizuj loty, atrakcje, pogodę i transport dla każdej destynacji
4. **Formatowanie odpowiedzi:** Stwórz przyjazną, pomocną odpowiedź z porównaniem i rekomendacjami

## FORMAT ODPOWIEDZI:

Pokazuj 3-5 najlepszych opcji (chyba że użytkownik prosi o więcej/mniej).

Dla każdej destynacji przedstaw:
- 🛫 **Lot:** cena, daty, czas lotu, przesiadki
- 🌤️ **Pogoda:** temperatura, warunki pogodowe z emoji
- 📍 **Atrakcje:** top 3 must-see miejsca
- 🚍 **Transport:** najlepsze opcje z lotniska do centrum

Dodaj:
- Osobisty komentarz/insight dla każdej destynacji
- Wyraźną rekomendację "najlepszego wyboru" z uzasadnieniem
- Kontekst sezonowy (wydarzenia, pogoda, tłumy)

## STYL KOMUNIKACJI:

- Bądź ciepły, entuzjastyczny ale profesjonalny
- Używaj emoji dla lepszej czytelności (ale nie przesadzaj)
- Formatuj ładnie z użyciem nagłówków Markdown
- Odpowiadaj zwięźle - użytkownik chce konkretów, nie eseju
- Jeśli brakuje informacji - zapytaj wprost

## WIELOJĘZYCZNOŚĆ:

- Wykryj język użytkownika (polski/angielski)
- Odpowiadaj w tym samym języku
- Formatuj daty i liczby według lokalnych konwencji

## KODY LOTNISK (przykłady):

**Polska:** WAW (Warszawa), KRK (Kraków), GDN (Gdańsk)
**Popularne destynacje:** BCN (Barcelona), LIS (Lizbona), ROM (Rzym), PAR (Paryż), LON (Londyn), AMS (Amsterdam)

Gdy użytkownik pyta o "loty z Warszawy" - użyj WAW jako origin.

## PRZYKŁAD DOBREJ ODPOWIEDZI:

Znalazłem 3 świetne opcje na Twój wyjazd! ✈️

### 🥇 Barcelona - Najlepsza wartość
**Lot:** 420 PLN, 18-25 kwietnia (bezpośredni, 3h)
**Pogoda:** ☀️ 22°C, słonecznie - idealne!
**Must-see:** Sagrada Familia, Park Güell, Las Ramblas
**Transport:** Aerobus 5.90 EUR (35 min) - szybko i tanio

*Polecam szczególnie - świetna pogoda, dużo do zobaczenia, super cena!*

[... kolejne opcje ...]

---

**Moja rekomendacja:** Barcelona - najlepszy stosunek ceny do atrakcji, plus gwarancja słonecznej pogody w kwietniu. 🌟`

/**
 * Tool definition for searching destinations
 */
export const SEARCH_DESTINATIONS_TOOL: Anthropic.Tool = {
  name: 'search_destinations',
  description:
    'Wyszukuje kompleksowe informacje o podróży: loty, atrakcje, pogodę i transport dla podanych parametrów. Wywołaj gdy użytkownik chce znaleźć loty lub zaplanować podróż.',
  input_schema: {
    type: 'object',
    properties: {
      origin: {
        type: 'string',
        description:
          'Kod IATA lotniska wylotu (np. WAW dla Warszawy, KRK dla Krakowa). WYMAGANE.',
      },
      destination: {
        type: 'string',
        description:
          'Kod IATA lotniska docelowego (np. BCN, LIS) lub "anywhere" dla inspiracji podróży',
      },
      departureDate: {
        type: 'string',
        description: 'Data wylotu w formacie YYYY-MM-DD. WYMAGANE.',
      },
      returnDate: {
        type: 'string',
        description: 'Data powrotu w formacie YYYY-MM-DD (opcjonalne dla lotów w jedną stronę)',
      },
      maxPrice: {
        type: 'number',
        description: 'Maksymalna cena lotu w PLN (np. 500)',
      },
      maxArrivalTime: {
        type: 'string',
        description: 'Maksymalna godzina przylotu w formacie HH:mm (np. "18:00")',
      },
      minDuration: {
        type: 'number',
        description: 'Minimalna długość pobytu w dniach',
      },
      maxDuration: {
        type: 'number',
        description: 'Maksymalna długość pobytu w dniach (np. 7)',
      },
      directFlightsOnly: {
        type: 'boolean',
        description: 'Czy pokazać tylko loty bezpośrednie (true/false)',
      },
      preferences: {
        type: 'string',
        description:
          'Preferencje użytkownika: "plaża", "kultura", "party", "natura", "romantycznie", itp.',
      },
      maxResults: {
        type: 'number',
        description: 'Ile opcji pokazać (domyślnie 3, max 10)',
      },
    },
    required: ['origin', 'departureDate'],
  },
}

/**
 * Extract search parameters from user message using Claude
 */
export async function extractSearchParams(
  userMessage: string,
  conversationHistory: Anthropic.MessageParam[] = []
): Promise<FlightSearchParams | null> {
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
  ]

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }, // Enable prompt caching
        },
      ],
      messages,
      tools: [SEARCH_DESTINATIONS_TOOL],
    })

    // Check if Claude wants to use the tool
    const toolUse = response.content.find((block) => block.type === 'tool_use')

    if (toolUse && toolUse.type === 'tool_use') {
      return toolUse.input as FlightSearchParams
    }

    // If no tool use, Claude might need more information
    return null
  } catch (error) {
    console.error('❌ Claude API error (extract params):', error)
    throw error
  }
}

/**
 * Format destinations data into a friendly response using Claude
 */
export async function formatDestinationsResponse(
  userMessage: string,
  destinationsData: any,
  conversationHistory: Anthropic.MessageParam[] = []
): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool_use',
          id: 'search_destinations_call',
          name: 'search_destinations',
          input: {}, // Placeholder
        },
      ],
    },
    {
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: 'search_destinations_call',
          content: JSON.stringify(destinationsData),
        },
      ],
    },
  ]

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' }, // Enable prompt caching
        },
      ],
      messages,
    })

    // Extract text content
    const textContent = response.content.find((block) => block.type === 'text')

    if (textContent && textContent.type === 'text') {
      return textContent.text
    }

    return 'Przepraszam, nie udało mi się sformatować odpowiedzi. Spróbuj ponownie.'
  } catch (error) {
    console.error('❌ Claude API error (format response):', error)
    throw error
  }
}

/**
 * Create a streaming response from Claude
 */
export async function* streamClaudeResponse(
  userMessage: string,
  conversationHistory: Anthropic.MessageParam[] = []
): AsyncGenerator<string, void, unknown> {
  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
  ]

  try {
    const stream = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
      stream: true,
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text
      }
    }
  } catch (error) {
    console.error('❌ Claude API error (streaming):', error)
    throw error
  }
}
