// API utilities for chat and voice services

import { ConversationMessage } from './bento-types';

export interface ChatResponse {
  id: string;
  content: string;
  context?: string;
  suggestions?: string[];
}

export interface VoiceRequest {
  text: string;
  language?: 'pt-BR' | 'en-US';
  voiceId?: string;
  rate?: number;
  pitch?: number;
}

export interface VoiceResponse {
  audioUrl: string;
  duration: number;
  format: string;
}

/**
 * Generate contextual response based on conversation context
 */
export async function generateChatResponse(
  userMessage: string,
  context: 'recipe' | 'local_politics' | 'general' | 'icms' = 'general',
  conversationHistory: ConversationMessage[] = [],
): Promise<ChatResponse> {
  try {
    // Simulated response - in production would call AI service
    const responses: Record<string, string> = {
      recipe: `Com base no seu inventário, tenho ótimas receitas para você. Posso sugerir pratos que levam aproximadamente 15-20 minutos para preparar.`,
      local_politics: `Temos atualizações importantes da câmara municipal sobre segurança alimentar. A votação é em breve.`,
      icms: `Seus últimos recibos mostram potencial de R$ 145,50 em créditos ICMS em SP. Posso detalhar qual produto gera cada crédito.`,
      general: `Como posso ajudá-lo com receitas, créditos fiscais ou notícias da câmara municipal?`,
    };

    return {
      id: Date.now().toString(),
      content: responses[context] || responses.general,
      context,
      suggestions: generateSuggestions(context),
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

/**
 * Generate voice audio from text
 */
export async function generateVoiceAudio(request: VoiceRequest): Promise<VoiceResponse> {
  try {
    const params = new URLSearchParams({
      text: request.text,
      lang: request.language || 'pt-BR',
      rate: (request.rate || 1).toString(),
      pitch: (request.pitch || 1).toString(),
    });

    // Simulated response - in production would call TTS service
    return {
      audioUrl: `data:audio/mp3;base64,SUQzBAAAAAAAI1NUVEUAAAAOAAAADExhdmY...`, // placeholder
      duration: Math.ceil(request.text.length / 15), // rough estimate
      format: 'mp3',
    };
  } catch (error) {
    console.error('Error generating voice audio:', error);
    throw error;
  }
}

/**
 * Transcribe voice input to text
 */
export async function transcribeVoiceInput(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', 'pt-BR');

    // Simulated response - in production would call STT service
    return 'Qual é a melhor receita para o almoço?';
  } catch (error) {
    console.error('Error transcribing voice input:', error);
    throw error;
  }
}

/**
 * Determine conversation context from user message
 */
export function determineContext(userMessage: string): 'recipe' | 'local_politics' | 'general' | 'icms' {
  const lowerMessage = userMessage.toLowerCase();

  const recipeKeywords = ['receita', 'receitar', 'prato', 'preparar', 'cozinhar', 'ingrediente'];
  const politicsKeywords = ['câmara', 'vereador', 'votação', 'política', 'lei', 'município'];
  const icmsKeywords = ['icms', 'crédito', 'imposto', 'fiscal', 'tributo', 'nota fiscal'];

  if (recipeKeywords.some((kw) => lowerMessage.includes(kw))) return 'recipe';
  if (politicsKeywords.some((kw) => lowerMessage.includes(kw))) return 'local_politics';
  if (icmsKeywords.some((kw) => lowerMessage.includes(kw))) return 'icms';

  return 'general';
}

/**
 * Generate contextual suggestions
 */
function generateSuggestions(context: 'recipe' | 'local_politics' | 'general' | 'icms'): string[] {
  const suggestions: Record<string, string[]> = {
    recipe: ['Mostrar minha receita preferida', 'Novo prato rápido', 'Receita sem glúten'],
    local_politics: ['Últimas votações', 'Agenda da câmara', 'Meus vereadores'],
    icms: ['Ver meus créditos', 'Histórico de notas', 'Ajuda com categorias'],
    general: ['Receitas agora', 'Notícias locais', 'Meus créditos'],
  };

  return suggestions[context] || suggestions.general;
}

/**
 * Format voice instruction for recipe cooking
 */
export function formatCookingInstruction(
  step: number,
  instruction: string,
  duration?: number,
): string {
  let formatted = `Passo ${step}. ${instruction}`;

  if (duration) {
    formatted += ` Isso deve levar aproximadamente ${duration} minutos.`;
  }

  return formatted;
}

/**
 * Generate ICMS summary text
 */
export function generateICMSSummary(totalCredit: number, itemCount: number, state: string): string {
  return `Você pode gerar aproximadamente R$ ${totalCredit.toFixed(2)} em créditos ICMS em ${state} com base em ${itemCount} itens analisados.`;
}

/**
 * Parse user recipe preferences from conversation
 */
export function parseRecipePreferences(userMessage: string): {
  maxPrepTime?: number;
  difficulty?: string;
  dietary?: string[];
  cuisine?: string;
} {
  const preferences: any = {};

  // Parse prep time
  const timeMatch = userMessage.match(/(\d+)\s*(minuto|min)/);
  if (timeMatch) {
    preferences.maxPrepTime = parseInt(timeMatch[1]);
  }

  // Parse difficulty
  if (userMessage.toLowerCase().includes('rápido') || userMessage.toLowerCase().includes('fácil')) {
    preferences.difficulty = 'easy';
  } else if (userMessage.toLowerCase().includes('médio')) {
    preferences.difficulty = 'medium';
  } else if (userMessage.toLowerCase().includes('difícil')) {
    preferences.difficulty = 'hard';
  }

  // Parse dietary restrictions
  const dietary: string[] = [];
  if (userMessage.toLowerCase().includes('vegano')) dietary.push('vegan');
  if (userMessage.toLowerCase().includes('vegetariano')) dietary.push('vegetarian');
  if (userMessage.toLowerCase().includes('sem glúten')) dietary.push('gluten-free');
  if (userMessage.toLowerCase().includes('sem lactose')) dietary.push('lactose-free');

  if (dietary.length > 0) {
    preferences.dietary = dietary;
  }

  return preferences;
}
