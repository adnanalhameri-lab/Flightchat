# ✈️ FlightChat - AI Travel Assistant

**FlightChat** to konwersacyjny asystent podróży oparty na AI, który pomaga znaleźć idealne loty, atrakcje, informacje o pogodzie i transporcie - wszystko poprzez naturalną rozmowę.

## 🎯 Główne Funkcje

- 🛫 **Wyszukiwanie lotów** - Amadeus API (test/production)
- 📍 **Atrakcje turystyczne** - OpenTripMap API  
- 🌤️ **Prognozy pogody** - OpenWeather API
- 🚍 **Transport z lotniska** - Hardcoded data dla popularnych lotnisk
- 🤖 **AI Assistant** - Claude Sonnet 4.5 z prompt caching
- 💬 **Streaming responses** - Odpowiedzi w czasie rzeczywistym
- 🗂️ **Chat folders** - Multi-conversation history (jak ChatGPT)
- 🔐 **Authentication** - Clerk (Google, Facebook, Email)
- 💳 **Subscriptions** - Stripe weekly payments
- ⚡ **Caching** - Redis dla optymalizacji kosztów

## 🚀 Quick Start

### Wymagania

- Node.js 18+ i npm
- Konta w:
  - [Clerk](https://clerk.com) - Authentication
  - [Supabase](https://supabase.com) - Database
  - [Stripe](https://stripe.com) - Payments
  - [Anthropic](https://console.anthropic.com) - Claude API
  - [Amadeus](https://developers.amadeus.com) - Flight API
  - [OpenTripMap](https://opentripmap.io) - Attractions API
  - [OpenWeather](https://openweathermap.org) - Weather API
  - [Upstash](https://upstash.com) - Redis caching

### Instalacja

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in all API keys (see setup guides below)

3. **Setup Supabase database:**
   - Follow instructions in `SUPABASE_SETUP.md`
   - Run the SQL schema provided

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📚 API Setup Guides

### 1. Clerk Authentication

1. Go to [clerk.com](https://clerk.com) → Create application
2. Enable sign-in: Google, Facebook, Email/Password
3. Copy keys to `.env.local`

### 2. Supabase Database

See `SUPABASE_SETUP.md` for detailed schema and setup.

### 3. Stripe Payments

1. Create account at [stripe.com](https://stripe.com)
2. Use **Test mode** for development
3. Create product: "FlightChat Weekly" at $10/week
4. Setup webhook for subscription events

### 4. Anthropic Claude API

1. Get API key from [console.anthropic.com](https://console.anthropic.com)
2. Cost: ~$0.005-0.015 per query with prompt caching

### 5. Amadeus Flight API

1. Register at [developers.amadeus.com](https://developers.amadeus.com)
2. Start with `AMADEUS_ENVIRONMENT=test` (unlimited free, fake data)
3. Switch to `production` for real flights (40k free/month)

### 6. OpenTripMap (FREE)

1. Get key from [opentripmap.io](https://opentripmap.io)
2. Unlimited free requests

### 7. OpenWeather (FREE)

1. Get key from [openweathermap.org](https://openweathermap.org)
2. Free tier: 1,000 calls/day

### 8. Upstash Redis (FREE)

1. Create database at [upstash.com](https://upstash.com)
2. Free tier: 10k commands/day

## 💰 Cost Breakdown

### Testing (~500 queries/month):
- **Total:** ~$5-10/month (only Claude API)

### Production (5,000 queries/month):
- **Claude:** $25-75
- **Other APIs:** $0 (free tiers)
- **Total:** ~$25-100/month

All other services have generous free tiers!

## 🧪 Test Queries

Try these in Polish:
- "Znajdź loty z Warszawy do Barcelony 18-25 kwietnia"
- "Pokaż najtańsze kierunki z Polski w maju, max 500 PLN"
- "Chcę polecieć na ciepłe miejsce, plaża, 7 dni"

## 🏗️ Project Structure

```
flight-chat/
├── app/                 # Next.js pages & API routes
├── components/         # React components  
├── lib/                # API clients & utilities
├── store/              # Zustand state management
└── .env.local         # Environment variables
```

## 📦 Deployment

1. Push to GitHub
2. Deploy to Vercel
3. Add environment variables
4. Update webhook URLs

## 🗺️ Roadmap

**Phase 1 (Current):** Flights + Attractions + Weather + Transport
**Phase 2:** Hotels, Full trip costs, Maps
**Phase 3:** Activities, Restaurants, Full itinerary planning

## 📄 License

MIT License

---

Built with Next.js, Claude AI, and ❤️
