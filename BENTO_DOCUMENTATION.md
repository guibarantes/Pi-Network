# Bento - Meal Prep & Local Politics Assistant

**Bento** is an innovative mobile-first web app that combines meal preparation assistance with local civic engagement, helping users discover recipes based on available ingredients, understand ICMS tax credits, and stay informed about local municipal news.

## Overview

Bento is designed to make cooking easier while keeping users connected to their local community. The app analyzes grocery receipts to identify potential tax credits (ICMS), suggests recipes based on available ingredients, and delivers personalized local news from municipal councils.

## Key Features

### 1. Smart Recipe Suggestions
- **Inventory-based matching**: Analyzes available ingredients and suggests recipes with compatibility percentages
- **Meal timing**: Recommends appropriate recipes for breakfast, lunch, snacks, and dinner based on time of day
- **Step-by-step cooking**: Guides users through recipes with timed instructions and integrated local news

### 2. Receipt Analysis & ICMS Tax Credits
- **Photo scanning**: Photograph market receipts to identify items and their ICMS potential
- **Manual entry**: Manually input items for analysis
- **State-specific calculations**: Calculates tax credits based on state-specific ICMS rates
- **Credit aggregation**: Tracks cumulative credit potential across multiple purchases

### 3. Voice & Chat Interface
- **Portuguese & English support**: Multilingual voice assistance in Portuguese (Brazil) and English
- **Context-aware conversations**: Discusses recipes, ICMS education, or local politics based on user preferences
- **Voice instructions**: Provides cooking guidance through audio
- **Hands-free cooking**: Control app via voice while cooking

### 4. Local News Integration
- **Municipal council updates**: Real-time news from your local câmara (city council)
- **Policy tracking**: Stay informed about food safety, restaurant regulations, and agricultural programs
- **Cooking-integrated news**: News appears during recipe preparation at relevant steps
- **Impact indicators**: Visual priority markers for high-impact legislation

### 5. User Personalization
- **Preference management**: Configure voice language, conversation topics, and notification settings
- **Location-based services**: Get news and tax info relevant to your state and municipality
- **Meal scheduling**: Set preferred times for breakfast, lunch, snacks, and dinner
- **User classes**: Free and premium tiers with feature differentiation

## Project Structure

```
/app
  /api
    /chat/route.ts                 # Chat message handling
    /recipes/match/route.ts        # Recipe matching engine
    /icms/analyze/route.ts         # ICMS credit analysis
    /news/local/route.ts           # Local news fetching
  /layout.tsx                      # Root layout with metadata
  /page.tsx                        # Home page with tabs
  /globals.css                     # Design tokens & theme

/components
  /quick-meal-suggestions.tsx      # Meal suggestion cards
  /receipt-scanner.tsx            # Receipt scanning interface
  /conversation-widget.tsx        # Chat interface
  /local-news-strip.tsx           # News feed display
  /recipe-cooking-page.tsx        # Step-by-step cooking guide
  /settings-page.tsx              # User preferences

/lib
  /bento-types.ts                 # TypeScript interfaces
  /recipe-engine.ts               # Recipe matching algorithms
  /voice-chat-service.ts          # Chat & voice utilities
  /news-service.ts                # News processing
  /user-preferences-service.ts    # User settings management
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Styling**: Design tokens with OKLCH color space
- **APIs**: REST endpoints for recipes, ICMS, news, and chat
- **TypeScript**: Full type safety throughout

## Color System

The app uses a warm, community-focused palette:
- **Primary**: Warm orange (#D27C35 / oklch 0.65 0.22 40)
- **Accent**: Warm coral (#E89968 / oklch 0.72 0.18 30)
- **Backgrounds**: Cream & warm whites
- **Dark mode**: Warm browns and creams

## Key Components

### QuickMealSuggestions
Displays recipe recommendations with:
- Ingredient compatibility percentage
- Preparation time and difficulty
- Missing item counts
- Visual match indicators

### ReceiptScanner
Enables two modes:
- **Camera mode**: Photo capture and AI recognition
- **Manual mode**: Type items and store selection
- ICMS credit calculation and aggregation
- Item confidence indicators

### ConversationWidget
Interactive chat with:
- Message history display
- Voice activation button
- Context-aware quick actions
- Real-time response simulation

### LocalNewsStrip
Curated news feed showing:
- Municipal council updates
- Policy changes affecting food
- Impact severity indicators
- Category-based filtering

### RecipeCookingPage
Guided cooking experience with:
- Step-by-step instructions
- Ingredient availability tracking
- Progress indicator
- Voice narration support
- Integrated local news reading during cooking

### SettingsPage
User configuration including:
- Voice preferences (language, voice type)
- Notification settings
- Location configuration
- ICMS education materials
- Premium features

## API Endpoints

### `/api/chat` (POST)
Process user messages and generate contextual responses
- Input: `{ message, context?, userId }`
- Output: `{ id, content, context, suggestions }`

### `/api/recipes/match` (POST)
Calculate recipe compatibility scores
- Input: `{ inventory, mealType? }`
- Output: `{ recipes[], totalMatches }`

### `/api/icms/analyze` (POST)
Analyze items for ICMS credit potential
- Input: `{ items[], state }`
- Output: `{ items[], summary }`

### `/api/news/local` (GET)
Fetch local municipal news
- Query: `municipality, state, category?, limit?`
- Output: `{ news[], total, timestamp }`

## Business Logic

### Recipe Matching Algorithm
1. Extract inventory items
2. Match recipe ingredients against inventory
3. Calculate match percentage: (matched / total non-optional) × 100
4. Rank by percentage
5. Return sorted suggestions

### ICMS Credit Calculation
1. Categorize items (meat, produce, processed, etc.)
2. Look up state-specific rate
3. Calculate credit: itemPrice × stateRate × categoryRate
4. Aggregate across items
5. Return per-item and total credits

### Meal Time Logic
- Detect current meal period
- Filter recipes by meal type
- Suggest recipes appropriate for time of day
- Send reminders at meal windows

## User Preferences

Default preferences include:
- Voice enabled in Portuguese (Brazil)
- Local politics focus
- Notifications enabled
- Standard meal times (6am-11am breakfast, etc.)

Premium users get:
- Custom conversation topics
- Advanced ICMS tracking
- Priority news alerts
- Multi-language support

## Future Enhancements

- Real AI integration (OpenAI, Google Vertex)
- Photo recognition via cloud vision API
- Integration with actual news sources
- Database persistence (Supabase, Neon)
- Receipt OCR for text extraction
- Real text-to-speech integration
- Push notifications
- Social sharing features
- Recipe ratings & history
- Nutrition tracking

## Accessibility

- ARIA labels on interactive elements
- Screen reader optimized
- Keyboard navigation support
- High contrast mode support
- Large touch targets for mobile
- Semantic HTML structure

## Mobile Optimization

- Mobile-first responsive design
- Touch-optimized UI
- Efficient image loading
- Network-aware features
- Battery-conscious operations
- Camera permission handling

## Getting Started

1. **Install dependencies** (if using local development):
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   # or
   pnpm build
   ```

4. **Access the app**:
   - Open http://localhost:3000
   - The app is mobile-optimized and responsive

## Environment Variables

Currently uses placeholder APIs. To integrate real services, add:
```env
OPENAI_API_KEY=your_key
GOOGLE_VISION_API_KEY=your_key
NEWS_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Support

For questions or issues, contact support@bentoapp.local

---

**Made with App Studio** - Your intelligent meal prep and civic engagement companion.
