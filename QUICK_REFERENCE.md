# Bento App - Quick Reference Guide

## Home Page Structure

The home page uses a tabbed interface to organize all major features:

### Tab 1: Home (Default)
- Current location display
- Meal greeting card
- Quick meal suggestions (3 cards with compatibility %)
- Action cards (Photo, Voice)
- ICMS credit alert
- Current time and meal window

### Tab 2: Receipt (Recibo)
- Dual-mode scanner:
  - Camera mode: Photo capture
  - Manual mode: Type items and store
- Store selection dropdown
- Item list with confidence scores
- ICMS credit potential display
- Add to inventory button

### Tab 3: Chat (Conversa)
- Full conversation history
- User and assistant messages with timestamps
- Voice activation button
- Quick action buttons:
  - "Receitas Agora" (Recipes Now)
  - "Meus Créditos" (My Credits)
- Real-time message input

### Tab 4: News (Notícias)
- Local news feed
- Impact severity indicators (high/medium/low)
- Category badges (Legislation, Politics, Budget, Public Works)
- Time since publication
- News content preview
- Source attribution

---

## Component Hierarchy

```
HomePage
├── Header (Logo + Settings)
├── Tabs Navigation
│   ├── Home Tab
│   │   ├── Location Badge
│   │   ├── Greeting Card
│   │   └── QuickMealSuggestions
│   │       └── [MealCard] × 3
│   ├── Receipt Tab
│   │   └── ReceiptScanner
│   │       ├── Camera/Manual Tabs
│   │       └── ItemList
│   ├── Chat Tab
│   │   └── ConversationWidget
│   │       ├── MessageHistory
│   │       └── InputArea
│   └── News Tab
│       └── LocalNewsStrip
│           └── [NewsCard] × N
└── Footer
```

---

## Data Flow

### Recipe Discovery
1. User views home or enters inventory
2. App sends inventory to `/api/recipes/match`
3. API calculates compatibility for each recipe
4. Results sorted by percentage
5. User can view full recipe or start cooking

### ICMS Analysis
1. User captures receipt or enters items
2. App groups items by category
3. `/api/icms/analyze` called with items and state
4. API calculates credits per item
5. Total potential displayed
6. Items added to inventory

### Chat Conversation
1. User types or speaks message
2. App determines context
3. `/api/chat` endpoint processes message
4. Context-aware response generated
5. Message added to history
6. Suggestions displayed

### News Integration
1. App fetches local news from `/api/news/local`
2. Filters by user's municipality
3. Sorts by recency and impact
4. News assigned to cooking steps
5. Displayed during recipe preparation

---

## Styling Reference

### Color Usage
- **Primary (Orange)**: Buttons, key actions, current step
- **Accent (Coral)**: Highlights, important stats
- **Muted (Gray)**: Secondary text, disabled states
- **Success (Green)**: Completed items, ICMS credits
- **Warning (Yellow)**: Warnings, missing items
- **Destructive (Red)**: Errors, high priority

### Text Hierarchy
- **H1**: App title (2xl font-bold)
- **H2**: Section titles (lg font-semibold)
- **H3**: Card titles (sm font-semibold)
- **Body**: Regular text (sm text-foreground)
- **Muted**: Secondary info (xs text-muted-foreground)

### Spacing
- Container: max-w-2xl with px-4
- Section gaps: space-y-6
- Card padding: p-4 or p-6
- Button padding: px-3 py-2
- Icon spacing: w-4 h-4 or w-5 h-5

---

## User Preferences

### Voice Settings
- Language: Portuguese (Brazil) or English
- Voice Type: Male or Female
- Rate: Speed adjustment (0.5 - 2.0)
- Pitch: Tone adjustment (0.5 - 2.0)

### Notification Settings
- Meal reminders at meal times
- News alerts for high-impact items
- Push notifications on/off

### Location Settings
- State selection
- Municipality text input
- Used for ICMS rates and news filtering

### Conversation Topics
- Local Politics (default)
- Recipes & Cooking
- ICMS Education
- Mixed topics

---

## Recipe Cooking Flow

1. **Recipe Details**: View prep time, servings, difficulty
2. **Ingredients Tab**: Check what you have vs missing
3. **Instructions Tab**: 
   - Current step highlighted in primary color
   - Step number badge (blue for current, green for done)
   - Timer per step
   - Related news item (if available)
4. **Mark Complete**: Move to next step
5. **Progress Bar**: Visual completion indicator
6. **Voice Support**: Listen to instructions

---

## ICMS Credit Reference

### Typical Rates by State (SP example)
- Carnes (Meat): 12% → 0% credit (isenção)
- Aves (Poultry): 12% → 0% credit
- Vegetais (Vegetables): 0% → 0% credit
- Frutas (Fruits): 0% → 0% credit  
- Laticínios (Dairy): 0% → 0% credit
- Processados (Processed): 7% → available credit

### Calculation Example
- Item: Frango Integral (Whole Chicken)
- Price: R$ 45.00
- Category Rate: 12%
- ICMS Rate SP: 0% (basic food)
- Credit: R$ 45 × 0.12 × 0% = R$ 0

- Item: Alimento Processado (Processed Food)
- Price: R$ 30.00
- Category Rate: 7%
- ICMS Rate SP: 0% (basic food)
- Credit: R$ 30 × 0.07 × 0% = R$ 0

Note: Basic food items have ICMS exemption in Brazil

---

## Testing Scenarios

### Scenario 1: New User
1. Opens app
2. Selects location (São Paulo, SP)
3. Enters inventory items
4. Views suggested recipes
5. Starts cooking guide

### Scenario 2: Tax Credit Seeker
1. Takes photo of receipt
2. App recognizes items
3. Views ICMS potential
4. Adds items to inventory
5. Repeats with more receipts

### Scenario 3: Local Politics Engaged User
1. Reads news feed
2. Learns about upcoming votes
3. Prepares meal while listening to news
4. Discusses policies in chat

### Scenario 4: Voice-First Cooking
1. Activates voice mode
2. Asks for dinner suggestion
3. Starts voice-guided recipe
4. Completes steps via voice commands
5. Hears related local news

---

## Keyboard Shortcuts (Future Enhancement)

- `/` - Open search
- `V` - Toggle voice
- `N` - Next step (cooking)
- `P` - Previous step (cooking)
- `ESC` - Close modal/dialog
- `?` - Help menu

---

## Error Handling

### Network Errors
- Toast notification with retry button
- Fallback to cached data if available
- Queue actions for retry

### Input Validation
- Required fields marked with *
- Real-time validation feedback
- Clear error messages in Portuguese
- Suggestion for fixing issues

### Location Issues
- Default to São Paulo if not detected
- Allow manual municipality entry
- Verify location format

---

## Accessibility Tips

- Use keyboard to navigate tabs
- Screen reader will announce:
  - Tab names and current selection
  - Button purposes
  - Form field labels
  - Dynamic content updates
- High contrast mode supported
- Touch targets are min 44×44 pixels

---

## Mobile Tips

- Swipe between tabs on mobile
- Portrait orientation optimized
- Camera access required for photo mode
- Microphone access required for voice
- Battery-efficient design

---

## Common Tasks

### Add Items to Inventory
1. Go to Receipt tab
2. Choose Manual entry
3. Select store
4. Type items (e.g., "Tomate 2kg, Frango 1.5kg")
5. Tap Analisar Itens
6. Review and add to inventory

### Get Recipe Suggestion
1. Home tab shows current suggestions
2. Or use Chat tab: "Quais receitas posso fazer?"
3. Select recipe to view details
4. Tap to start cooking guide

### Check ICMS Credits
1. Receipt tab shows immediate credit
2. Or Settings tab for summary
3. Tap "Ver Detalhes" for breakdown
4. See credits by category and item

### Change Preferences
1. Header Settings button
2. Voice Settings - adjust language/voice
3. Notifications - toggle types
4. Location - update municipality
5. Account - manage premium

---

## Tips & Tricks

- Recipes sorted by highest compatibility first
- Voice works best in Portuguese
- Take clear photos of receipts
- Manual entry is faster than camera
- Save favorite recipes (coming soon)
- Share shopping lists (coming soon)
- Meal reminders at scheduled times
- News integrated into cooking steps

---

**For more details, see BENTO_DOCUMENTATION.md**
