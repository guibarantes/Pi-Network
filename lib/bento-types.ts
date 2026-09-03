// Bento App Data Models

export interface User {
  id: string;
  name: string;
  email: string;
  userClass: 'free' | 'premium' | 'admin';
  location: {
    latitude: number;
    longitude: number;
    state: string;
    municipality: string;
  };
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  voiceEnabled: boolean;
  voiceLanguage: 'pt-BR' | 'en-US';
  conversationFocus: 'local_politics' | 'recipes' | 'both';
  mealTimePreferences: MealTiming[];
  notificationsEnabled: boolean;
}

export interface MealTiming {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  icmsRate?: number; // ICMS tax rate for this item
  state?: string; // State where purchased
}

export interface Receipt {
  id: string;
  userId: string;
  items: ReceiptItem[];
  totalAmount: number;
  purchaseDate: Date;
  storeName: string;
  stateCode: string;
  icmsPotential: ICMSCredit[];
  imageUrl?: string;
}

export interface ICMSCredit {
  state: string;
  itemName: string;
  rate: number;
  amount: number;
  category: string;
  applicability: 'applicable' | 'conditional' | 'not_applicable';
  reason: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'unit';
  category: string;
  addedDate: Date;
  expiryDate?: Date;
  source: 'manual' | 'receipt' | 'photo';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: CookingInstruction[];
  preparationTime: number; // minutes
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  rating?: number;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  optional: boolean;
}

export interface CookingInstruction {
  stepNumber: number;
  instruction: string;
  duration?: number; // minutes
  newsItemId?: string; // Associated local news to display
}

export interface SuggestedRecipe {
  recipe: Recipe;
  matchPercentage: number;
  missingIngredients: string[];
  optionalIngredients: string[];
  mealRecommendation: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string;
    explanation: string;
  };
}

export interface LocalNews {
  id: string;
  title: string;
  description: string;
  content: string;
  municipality: string;
  state: string;
  category: 'legislation' | 'politics' | 'budget' | 'public_works' | 'community';
  sourceUrl: string;
  publishedDate: Date;
  relevanceScore?: number;
}

export interface CookingSession {
  id: string;
  userId: string;
  recipeId: string;
  startedAt: Date;
  currentStep: number;
  newsAssignments: Map<number, string>; // step -> newsItemId
  voiceActive: boolean;
  notes: string[];
}

export interface ConversationMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: 'recipe' | 'local_politics' | 'general' | 'icms';
}
