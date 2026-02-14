# ✈️ FlightChat - AI-Powered Travel Assistant

<div align="center">

**Smart flight search with real-time data, powered by Claude AI**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Setup](#-api-setup) • [Deployment](#-deployment)

</div>

---

## 📖 About

**FlightChat** is an intelligent conversational travel assistant that helps users find real flights through natural language conversations. Simply ask "Find me flights from Warsaw to Barcelona in June" and get concrete flight options with prices, weather forecasts, local attractions, and airport transport information.

### Why FlightChat?

- 🎯 **Natural Language Search** - No complex forms, just chat naturally in Polish or English
- ✈️ **Real Flight Data** - Powered by Amadeus API with 500+ airlines worldwide
- 🤖 **AI-Powered** - Claude Sonnet 4.5 understands context and preferences
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS v4
- 💰 **Cost-Effective** - Smart caching and graceful degradation with mock data
- 🔒 **Secure** - Clerk authentication with social login support

---

## ✨ Features

### Core Functionality
- 🛫 **Flight Search** - Real-time flight offers via Amadeus API (test/production modes)
- 📍 **Attractions** - Top tourist spots at destination (OpenTripMap API)
- 🌤️ **Weather Forecasts** - 7-day weather predictions (OpenWeather API)
- 🚍 **Airport Transport** - Metro, bus, train info for major airports
- 💬 **Conversation History** - Multi-conversation management with auto-generated titles
- 🗂️ **Organized Chats** - Grouped by Today, Yesterday, Last Week, etc.

### Technical Features
- ⚡ **Mock Data Fallback** - Graceful degradation when APIs unavailable
- 🎨 **Responsive Design** - Mobile-first, works on all screen sizes
- 🔐 **Authentication** - Google, Email/Password via Clerk
- 💾 **State Persistence** - Zustand with localStorage sync
- 🚫 **Hydration-Safe** - Zero hydration errors in SSR/CSR
- 🔄 **Non-Streaming API** - Reliable, error-free responses

---

## 🎬 Demo

### Example Conversations

**User:** "Znajdź loty z Warszawy do Barcelony w czerwcu"

**FlightChat:** Returns 5 flight options with:
- ✈️ Airline, flight duration, departure/arrival times
- 💰 Price in PLN
- 🌡️ Weather forecast for Barcelona
- 🏛️ Top attractions (Sagrada Familia, Park Güell, etc.)
- 🚇 Airport transport options (Metro L9, Aerobus)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand
- **UI Components:** Custom React components
- **Authentication:** Clerk

### Backend
- **Runtime:** Node.js
- **API Routes:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Caching:** Upstash Redis
- **Payments:** Stripe

### External APIs
- **AI:** Anthropic Claude Sonnet 4.5
- **Flights:** Amadeus Flight Offers Search API
- **Attractions:** OpenTripMap API
- **Weather:** OpenWeather API

### DevOps
- **Version Control:** Git + GitHub
- **Deployment:** Vercel (recommended)
- **Environment:** `.env.local` for secrets

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Accounts for external services (see [API Setup](#-api-setup))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adnanalhameri-lab/Flightchat.git
   cd Flightchat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   ```
   http://localhost:3000
   ```

### Environment Variables

Create `.env.local` with the following keys:

```bash
# Required - App won't work without these
ANTHROPIC_API_KEY=sk-ant-...              # Claude AI (MUST have credits)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...  # Clerk auth
CLERK_SECRET_KEY=sk_...                   # Clerk auth

# Optional - Graceful degradation with mock data
AMADEUS_CLIENT_ID=...                     # Flight search (falls back to mock)
AMADEUS_CLIENT_SECRET=...                 # Flight search
AMADEUS_ENVIRONMENT=test                  # Use 'test' or 'production'

OPENTRIPMAP_API_KEY=...                   # Attractions (falls back to empty)
OPENWEATHER_API_KEY=...                   # Weather (falls back to null)

UPSTASH_REDIS_REST_URL=...                # Caching (optional)
UPSTASH_REDIS_REST_TOKEN=...              # Caching (optional)

# Payment features (optional)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (optional - not yet used)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 🔑 API Setup

### 1. Anthropic Claude API (Required)

1. Get API key: [console.anthropic.com](https://console.anthropic.com)
2. Add credits to account (~$5 for 500+ searches)
3. Cost: ~$0.005-0.015 per query

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 2. Clerk Authentication (Required)

1. Create app: [clerk.com](https://clerk.com)
2. Enable: Google OAuth, Email/Password
3. Copy keys from Dashboard → API Keys

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Amadeus Flight API (Optional - has mock fallback)

1. Register: [developers.amadeus.com](https://developers.amadeus.com)
2. Create app → Self-Service → Get credentials
3. **Test mode:** Unlimited free, fake data
4. **Production mode:** 40k free requests/month, real data

```bash
AMADEUS_CLIENT_ID=...
AMADEUS_CLIENT_SECRET=...
AMADEUS_ENVIRONMENT=test  # or 'production'
```

**Without Amadeus keys:** App uses realistic mock data (5 destinations, fixed prices)

### 4. OpenTripMap (Optional - FREE)

1. Get key: [opentripmap.io](https://opentripmap.io)
2. Unlimited free requests

```bash
OPENTRIPMAP_API_KEY=...
```

### 5. OpenWeather (Optional - FREE)

1. Get key: [openweathermap.org](https://openweathermap.org)
2. Free tier: 1,000 calls/day

```bash
OPENWEATHER_API_KEY=...
```

### 6. Upstash Redis (Optional - FREE)

1. Create database: [upstash.com](https://upstash.com)
2. Free tier: 10k commands/day

```bash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### 7. Stripe (Optional)

1. Create account: [stripe.com](https://stripe.com)
2. Use Test mode for development
3. Create webhook: `https://your-domain.com/api/webhooks/stripe`

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 8. Supabase (Optional - not yet implemented)

1. Create project: [supabase.com](https://supabase.com)
2. See `SUPABASE_SETUP.md` for schema

```bash
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 💰 Cost Breakdown

### Development/Testing (~500 queries/month)
- **Claude API:** ~$5-10/month
- **All other APIs:** FREE (mock data + free tiers)
- **Total:** ~$5-10/month

### Production (5,000 queries/month)
- **Claude API:** $25-75/month
- **Amadeus:** FREE (40k/month limit)
- **Other APIs:** FREE (generous limits)
- **Total:** ~$25-100/month

💡 **Cost optimization:**
- Amadeus caching reduces duplicate searches
- Mock data fallback eliminates API dependency
- Upstash Redis caches responses (10k free/day)

---

## 📁 Project Structure

```
Flightchat/
├── app/                          # Next.js 16 App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/[[...sign-in]]/
│   │   └── sign-up/[[...sign-up]]/
│   ├── (dashboard)/              # Protected routes
│   │   ├── chat/                 # Main chat interface
│   │   ├── settings/             # User settings
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── api/                      # API Routes
│   │   ├── chat/route.ts         # Main chat endpoint (308 lines)
│   │   ├── destinations/route.ts # Destination enrichment
│   │   └── webhooks/stripe/      # Payment webhooks
│   ├── globals.css               # Tailwind v4 styles
│   ├── layout.tsx                # Root layout with Clerk
│   └── page.tsx                  # Landing page
├── components/                   # React Components
│   ├── ChatInterface.tsx         # Main chat UI (148 lines)
│   ├── ChatMessage.tsx           # Message display with markdown
│   ├── ChatInput.tsx             # Message input field
│   ├── Sidebar.tsx               # Conversation history
│   ├── DestinationCard.tsx       # Flight result cards
│   ├── EmptyState.tsx            # Empty chat state
│   ├── LoadingIndicator.tsx      # Loading animations
│   ├── ComparisonView.tsx        # Multi-destination comparison
│   └── TransportInfo.tsx         # Airport transport display
├── lib/                          # Business Logic
│   ├── amadeus.ts                # Flight search + mock data (~230 lines)
│   ├── claude.ts                 # AI prompts & extraction (292 lines)
│   ├── opentripmap.ts            # Attractions API client
│   ├── openweather.ts            # Weather API client
│   ├── transport.ts              # Airport transport data
│   ├── supabase.ts               # Database client
│   ├── types.ts                  # TypeScript definitions (172 lines)
│   └── utils.ts                  # Utility functions
├── store/                        # State Management
│   └── chat-store.ts             # Zustand store (138 lines)
├── types/                        # Type Declarations
│   └── amadeus.d.ts              # Amadeus API types
├── middleware.ts                 # Clerk auth middleware
├── SUPABASE_SETUP.md            # Database schema guide
├── .env.local.example           # Environment template
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🏗️ Architecture

### Chat Flow

```
User Input → ChatInterface → POST /api/chat
                                 ↓
                          Claude extracts params
                          {origin, destination, date}
                                 ↓
                          Amadeus API / Mock Data
                                 ↓
                    Enrich with Weather + Attractions
                                 ↓
                          Claude formats response
                                 ↓
                     Display text + destination cards
```

### Key Design Decisions

1. **Non-Streaming API:**
   - Avoids Claude tool_use/tool_result errors
   - Simpler error handling
   - Easier to debug

2. **Prompt-Based Extraction:**
   - No tool-calling complexity
   - More reliable parameter parsing
   - Better handling of ambiguous queries

3. **Graceful Degradation:**
   - Mock flight data when Amadeus unavailable
   - Empty arrays for missing attractions/weather
   - App never crashes from missing APIs

4. **Hydration Safety:**
   - All client components check `mounted` state
   - Zustand store tracks hydration status
   - Timestamps render only after mount

---

## 🧪 Testing

### Manual Testing

Try these queries:

**Polish:**
- "Znajdź loty z Warszawy do Barcelony w czerwcu"
- "Pokaż najtańsze kierunki z Polski w maju"
- "Chcę polecieć na ciepłe miejsce, plaża, tydzień"

**English:**
- "Find flights from Warsaw to Barcelona in June"
- "Show me cheap flights from Poland in May"
- "I want to fly somewhere warm, beach, one week"

**Edge cases:**
- "Barcelona" (assumes WAW origin, +7 days)
- "20 czerwca" (extracts date, needs destination)
- "500 PLN max" (price filtering - not yet implemented)

### Expected Behavior

**With Amadeus API:**
- Returns real flight data from 500+ airlines
- Prices vary based on availability
- Dates/routes reflect actual schedules

**Without Amadeus API (mock mode):**
- Returns 5 predefined destinations
- Fixed prices (Barcelona 300 PLN, Lisbon 350 PLN, etc.)
- Still shows weather, attractions, transport

---

## 🐛 Bug Fixes (From Development)

### Fixed Issues:

1. **Hydration Errors** ✅
   - Added `mounted` state to all client components
   - Zustand hydration tracking with `onRehydrateStorage`
   - Suppress hydration warnings on date displays

2. **Tool-Calling Errors** ✅
   - Replaced streaming + tool-calling with simple prompt extraction
   - Eliminated `tool_use without tool_result` errors
   - Simplified API architecture (308 lines, easy to maintain)

3. **Flight Search Not Working** ✅
   - Improved Claude prompt clarity (CRITICAL: set needsSearch=true)
   - Added auto-defaults (origin=WAW, date=+7 days)
   - Mock data fallback for development

---

## 📈 Roadmap

### Phase 1: Core Features (✅ COMPLETED)
- [x] Natural language flight search
- [x] Amadeus API integration
- [x] Weather forecasts
- [x] Attractions
- [x] Airport transport info
- [x] Conversation persistence
- [x] Clerk authentication

### Phase 2: Enhancement (Next)
- [ ] Database persistence (Supabase)
- [ ] Stripe subscription payments
- [ ] Price filtering
- [ ] Flexible dates (±3 days)
- [ ] Class preference (economy/business)
- [ ] Multi-city trips

### Phase 3: Advanced Features
- [ ] Hotel search
- [ ] Car rentals
- [ ] Full trip cost calculator
- [ ] Interactive maps
- [ ] Booking integration
- [ ] Trip sharing

### Phase 4: Intelligence
- [ ] Price tracking & alerts
- [ ] Personalized recommendations
- [ ] Travel trends analysis
- [ ] Group travel planning
- [ ] Itinerary optimization

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done ✅)

2. **Import to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Add environment variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all keys from `.env.local`

4. **Update Clerk settings:**
   - Add production URL to allowed domains

5. **Update Stripe webhook:**
   - Point to `https://your-domain.vercel.app/api/webhooks/stripe`

### Alternative: Docker

```dockerfile
# Dockerfile (example)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Follow existing patterns (hydration safety, graceful degradation)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Adnan Alhameri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **Anthropic** - Claude AI API
- **Amadeus** - Flight data API
- **Clerk** - Authentication
- **Vercel** - Next.js framework & hosting
- **Tailwind Labs** - Tailwind CSS

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/adnanalhameri-lab/Flightchat/issues)
- **Email:** contact@example.com (update with your email)
- **Twitter:** @your_handle (update with your handle)

---

<div align="center">

**Built with Next.js 16, Claude AI, and ❤️**

[⬆ Back to top](#️-flightchat---ai-powered-travel-assistant)

</div>
