// User preferences and settings service

import { User, UserPreferences, MealTiming } from './bento-types';

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  voiceEnabled: true,
  voiceLanguage: 'pt-BR',
  conversationFocus: 'local_politics',
  mealTimePreferences: [
    { type: 'breakfast', startTime: '06:00', endTime: '11:00' },
    { type: 'lunch', startTime: '11:00', endTime: '14:00' },
    { type: 'snack', startTime: '14:00', endTime: '18:00' },
    { type: 'dinner', startTime: '18:00', endTime: '22:00' },
  ],
  notificationsEnabled: true,
};

/**
 * Get user preferences with defaults
 */
export function getUserPreferences(user: User | null): UserPreferences {
  if (!user) return DEFAULT_PREFERENCES;
  return { ...DEFAULT_PREFERENCES, ...user.preferences };
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>,
): Promise<UserPreferences> {
  try {
    const response = await fetch(`/api/users/${userId}/preferences`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) throw new Error('Failed to update preferences');
    const data = await response.json();
    return data.preferences;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}

/**
 * Check if current time is within meal window
 */
export function isCurrentMealTime(
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  preferences: MealTiming[],
): boolean {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const mealWindow = preferences.find((m) => m.type === mealType);
  if (!mealWindow) return false;

  return currentTime >= mealWindow.startTime && currentTime <= mealWindow.endTime;
}

/**
 * Get next scheduled meal
 */
export function getNextMeal(
  preferences: MealTiming[],
): (
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | null
) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Convert meal times to minutes for easier comparison
  const mealTimes = preferences.map((meal) => {
    const [hours, mins] = meal.startTime.split(':').map(Number);
    return {
      type: meal.type,
      startMinutes: hours * 60 + mins,
    };
  });

  // Find next meal
  const nextMeal = mealTimes
    .filter((m) => m.startMinutes > currentTime)
    .sort((a, b) => a.startMinutes - b.startMinutes)[0];

  return nextMeal?.type || null;
}

/**
 * Get user's municipality code
 */
export function getMunicipalityCode(municipality: string, state: string): string {
  // Simplified mapping - in production would use official IBGE codes
  const codes: Record<string, Record<string, string>> = {
    SP: {
      'São Paulo': '3550308',
      'Campinas': '3509007',
      'Santos': '3548708',
    },
    RJ: {
      'Rio de Janeiro': '3304557',
    },
    MG: {
      'Belo Horizonte': '3106200',
    },
  };

  return codes[state]?.[municipality] || 'unknown';
}

/**
 * Get recipe recommendations based on user preferences
 */
export function getRecipesForMealType(
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  preferences: UserPreferences,
): Record<string, any> {
  const mealConfigs = {
    breakfast: {
      maxPrepTime: 20,
      expectedCalories: '300-400',
    },
    lunch: {
      maxPrepTime: 45,
      expectedCalories: '500-800',
    },
    snack: {
      maxPrepTime: 15,
      expectedCalories: '100-200',
    },
    dinner: {
      maxPrepTime: 40,
      expectedCalories: '400-600',
    },
  };

  return mealConfigs[mealType];
}

/**
 * Get conversation topics based on user class
 */
export function getConversationTopics(userClass: 'free' | 'premium' | 'admin'): string[] {
  const topics = {
    free: ['receitas', 'ingredientes'],
    premium: ['receitas', 'ingredientes', 'local_politics', 'icms_education'],
    admin: ['receitas', 'ingredientes', 'local_politics', 'icms_education', 'system_management'],
  };

  return topics[userClass] || topics.free;
}

/**
 * Get available voices based on preferences
 */
export function getAvailableVoices(language: 'pt-BR' | 'en-US'): Array<{
  id: string;
  name: string;
  gender: 'male' | 'female';
}> {
  const voices = {
    'pt-BR': [
      { id: 'pt-BR-neural2-C', name: 'Ana (Feminino)', gender: 'female' as const },
      { id: 'pt-BR-neural2-B', name: 'Carlos (Masculino)', gender: 'male' as const },
    ],
    'en-US': [
      { id: 'en-US-neural2-E', name: 'English Female', gender: 'female' as const },
      { id: 'en-US-neural2-A', name: 'English Male', gender: 'male' as const },
    ],
  };

  return voices[language] || voices['pt-BR'];
}

/**
 * Validate user location
 */
export function isValidBrazilianLocation(state: string, municipality: string): boolean {
  // Simplified validation - in production would check against official list
  const validStates = ['SP', 'RJ', 'MG', 'BA', 'SC', 'RS'];
  return validStates.includes(state) && municipality.length > 0;
}

/**
 * Export user data
 */
export async function exportUserData(userId: string): Promise<Blob> {
  try {
    const response = await fetch(`/api/users/${userId}/export`, {
      method: 'GET',
    });

    if (!response.ok) throw new Error('Failed to export data');
    return await response.blob();
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}

/**
 * Delete user account
 */
export async function deleteUserAccount(userId: string, reason?: string): Promise<void> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) throw new Error('Failed to delete account');
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}
