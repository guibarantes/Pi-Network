# Getting Started with Bento

Welcome to **Bento** - your meal prep and local civic engagement assistant!

## Quick Start

### 1. Access the App
The app is ready to use immediately. Open it in your browser at `http://localhost:3000` (or your deployment URL).

### 2. First Steps
1. **Home Tab**: Browse suggested recipes based on a pre-populated inventory
2. **Receipt Tab**: Scan or enter grocery items to track ICMS credits
3. **Chat Tab**: Talk to the assistant about recipes, politics, or taxes
4. **News Tab**: Read local municipal council news

### 3. Main Features to Try

#### Recipe Discovery
- See "Frittata de Legumes", "Arroz com Brócolis", "Pasta Alho e Óleo"
- Each shows compatibility percentage (82-95%)
- Click to view full recipe with instructions
- Tap "Passo Completo" to mark each step done

#### Receipt Analysis
- Switch to **Manual** mode in Receipt tab
- Select "Carrefour - Consolação" store
- Enter items: "Tomate 2kg, Frango 1.5kg, Alho"
- See ICMS credit calculation

#### Voice Chat
- Type "Quais receitas posso fazer?" (What recipes can I make?)
- Get context-aware response
- Use quick buttons for common queries

#### Local News
- View news feed about São Paulo city council
- See impact indicators (red = high priority)
- Category badges (Legislation, Politics, Budget)

---

## Navigation Guide

### Header
- **Logo**: Click to return home (ready for home link)
- **Settings**: Click settings icon to view all preferences

### Tabs
- **Home** (Ícone de utensílios): Main dashboard
- **Receipt** (Ícone de câmera): Receipt scanning
- **Chat** (Ícone de microfone): Voice conversation
- **News** (Ícone de jornal): Local news feed

### Home Tab Sections
1. **Location Badge**: Shows "São Paulo, SP"
2. **Meal Greeting**: "Bom almoço!" with suggestions
3. **Quick Meals**: 3 recipe cards with images and stats
4. **Action Cards**: Photo capture and voice activation
5. **ICMS Alert**: Shows potential credits

---

## Feature Breakdown

### Recipe System

**Smart Matching**
```
Inventory: Ovos, Brócolis, Tomate, Cebola, Alho
Recipe: Frittata de Legumes
Match: 95% (5/5 ingredients available)
Time: 15 minutes
Difficulty: Easy
```

**How It Works**
1. You add items to inventory
2. App matches against recipe database
3. Shows compatibility percentage
4. Highest matches displayed first
5. Click recipe to see full details

### ICMS Tax Credit System

**Analysis Flow**
```
Receipt Item: Frango Integral 1.5kg @ R$ 45/kg = R$ 67.50
Category: Carnes (Meat)
Category Rate: 12%
ICMS Rate SP: 0% (basic food exemption)
Credit Potential: R$ 67.50 × 0% = R$ 0 (exempt)
```

**Supported States**
- SP (São Paulo): 18% ICMS rate
- RJ (Rio de Janeiro): 20% ICMS rate
- MG (Minas Gerais): 15% ICMS rate
- BA (Bahia): 17% ICMS rate
- SC (Santa Catarina): 12% ICMS rate
- RS (Rio Grande do Sul): 12% ICMS rate

### Voice & Chat

**Context-Aware Responses**
- "Receita" keyword → Recipe suggestions
- "Câmara" keyword → Political news
- "ICMS" keyword → Tax education
- Generic → General help

**Quick Actions**
- "Receitas Agora" → Current meal suggestions
- "Meus Créditos" → ICMS information
- Custom questions → Free chat

### Local News Integration

**News Categories**
- **Legislation** (Blue): New laws and regulations
- **Politics** (Purple): Political events and votes
- **Budget** (Green): Budget allocations
- **Public Works** (Orange): Infrastructure projects

**Impact Levels**
- **High** (Red indicator): Major legislation, affects many
- **Medium** (Yellow indicator): Important but limited scope
- **Low** (Gray indicator): Informational, lower impact

---

## Settings Configuration

### Voice Settings
Location: Settings → Assistente de Voz
- Toggle voice on/off
- Choose Portuguese or English
- Select conversation topic

### Notification Settings
Location: Settings → Notificações
- Meal reminders at scheduled times
- News alerts for high-impact items
- Push notifications

### Location Settings
Location: Settings → Localização
- State: São Paulo (default)
- Municipality: Type your city
- Used for: News filtering, ICMS rates

### ICMS Education
Location: Settings → Educação Fiscal
- View your potential credits
- Learn about ICMS categories
- Understand calculations

---

## Mock Data Examples

### Recipe Database
```javascript
{
  id: '1',
  name: 'Frittata de Legumes',
  prepTime: 15,
  difficulty: 'easy',
  ingredients: ['Ovos', 'Brócolis', 'Tomate', 'Cebola', 'Alho'],
  matchPercentage: 95
}
```

### Inventory
```javascript
{
  name: 'Tomate',
  quantity: 2,
  unit: 'kg',
  addedDate: Date.now()
}
```

### News Feed
```javascript
{
  id: '1',
  title: 'Câmara aprova Lei de Segurança Alimentar',
  category: 'legislation',
  municipality: 'São Paulo',
  state: 'SP',
  impact: 'high'
}
```

---

## Common Actions

### Add Recipe to Favorites (Future)
- View recipe details
- Tap heart icon
- See in "Meus Favoritos"

### Track Spending Over Time (Future)
- Submit receipts regularly
- View spending trends
- See ICMS accumulation

### Share Recipes (Future)
- Open recipe
- Tap share icon
- Send to friends

### Export Your Data (Future)
- Settings → Account
- Tap "Export Data"
- Download as PDF/CSV

---

## Keyboard Shortcuts (Ready for Implementation)

| Shortcut | Action |
|----------|--------|
| `/` | Open search |
| `V` | Toggle voice |
| `T` | Switch tabs |
| `ESC` | Close dialogs |
| `?` | Show help |

---

## Troubleshooting

### Location Not Updating
- Go to Settings → Localização
- Manually select your state
- Type your municipality name
- Changes apply immediately

### Recipes Not Showing
- Check inventory has items
- Visit Receipt tab to add items
- Or manually type items in Chat
- Home tab auto-refreshes

### Voice Not Working
- Check Settings → Assistente de Voz
- Verify "Ativar Assistente" is ON
- Select your language preference
- Grant microphone permission if prompted

### ICMS Credits Show R$ 0
- This is correct for basic foods
- Vegetables, fruits, dairy = no credit
- Processed foods may have credits
- Check "Educação Fiscal" for details

---

## Tips & Best Practices

### Recipe Discovery
- ✓ Keep inventory updated for better matches
- ✓ Check "Ingredients" tab before starting
- ✓ Read all instructions before cooking
- ✓ Use voice guide while cooking

### ICMS Tracking
- ✓ Save all grocery receipts
- ✓ Use manual entry for fast capture
- ✓ Check different states if traveling
- ✓ Review credits monthly

### Local News
- ✓ Check news tab before meal prep
- ✓ Set up high-impact alerts
- ✓ Engage with local politics
- ✓ Share important news

### Voice Usage
- ✓ Speak clearly for best recognition
- ✓ Use Portuguese for best results
- ✓ Ask specific questions
- ✓ Adjust volume as needed

---

## Integration Points Ready

When you're ready to add real services:

### Chat AI
Replace endpoint `/api/chat` with:
- OpenAI (GPT-4)
- Google Vertex
- Anthropic Claude
- or your preference

### Voice Services
Integrate with:
- Google Cloud TTS/STT
- Azure Speech Services
- ElevenLabs
- or your preference

### News Sources
Connect to:
- Local news APIs
- Government sites
- RSS feeds
- or your preference

### Database
Set up:
- Supabase PostgreSQL
- Neon PostgreSQL
- AWS Aurora
- or your preference

---

## Support & Help

### In-App Help
- Settings page has detailed explanations
- Tooltips on hover for most features
- Quick reference cards in dialogs

### Documentation
- `/BENTO_DOCUMENTATION.md` - Full feature guide
- `/QUICK_REFERENCE.md` - User guide
- `/PROJECT_SUMMARY.md` - Technical overview

### Contact
- Issues: Open GitHub issues (when available)
- Feedback: settings@bentoapp.local (placeholder)
- Support: support@bentoapp.local (placeholder)

---

## What's Next?

1. **Explore Features**: Try all tabs and features with mock data
2. **Customize**: Adjust location, language, preferences
3. **Integrate Real Services**: Connect AI, voice, and database
4. **Add Your Data**: Import your actual recipes and preferences
5. **Deploy**: Push to production with your real services
6. **Gather Feedback**: Iterate based on user needs

---

## Ready to Cook?

Your meal prep assistant is ready to go! 

- Start with the **Home** tab to see recipe suggestions
- Check **Receipt** tab to understand your tax credits
- Ask the **Chat** assistant anything about food, taxes, or politics
- Stay informed with the **News** tab about your community

**Let's get cooking and stay civically engaged!**

---

*Made with App Studio - Bento v1.0.0*

**Title**: Made with App Studio
