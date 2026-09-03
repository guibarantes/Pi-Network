// Recipe matching and suggestion algorithms

import { Recipe, InventoryItem, SuggestedRecipe, MealTiming } from './bento-types';

/**
 * Calculate how well a recipe matches available inventory
 */
export function calculateRecipeMatch(
  recipe: Recipe,
  inventory: InventoryItem[],
): SuggestedRecipe {
  const inventoryMap = new Map(inventory.map((item) => [item.name.toLowerCase(), item]));

  let matchedIngredients = 0;
  const missingIngredients: string[] = [];
  const optionalIngredients: string[] = [];

  recipe.ingredients.forEach((ingredient) => {
    const inventoryItem = inventoryMap.get(ingredient.name.toLowerCase());

    if (inventoryItem && inventoryItem.quantity >= ingredient.quantity) {
      matchedIngredients++;
    } else if (ingredient.optional) {
      optionalIngredients.push(ingredient.name);
    } else {
      missingIngredients.push(ingredient.name);
    }
  });

  const matchPercentage = Math.round(
    (matchedIngredients / (recipe.ingredients.filter((i) => !i.optional).length)) * 100,
  );

  return {
    recipe,
    matchPercentage,
    missingIngredients,
    optionalIngredients,
    mealRecommendation: {
      type: recipe.mealType,
      time: getCurrentMealTime(),
      explanation: generateMealExplanation(recipe, matchPercentage),
    },
  };
}

/**
 * Get suggestions for current meal time
 */
export function getCurrentMealTime(): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 18) return 'snack';
  return 'dinner';
}

/**
 * Get recommended recipes for current time
 */
export function getRecommendedRecipes(
  recipes: Recipe[],
  inventory: InventoryItem[],
  userMealPreferences: MealTiming[],
): SuggestedRecipe[] {
  const currentMealTime = getCurrentMealTime();

  // Filter recipes for current meal type
  const relevantRecipes = recipes.filter((r) => r.mealType === currentMealTime);

  // Calculate match percentage for each
  const suggestedRecipes = relevantRecipes.map((recipe) => calculateRecipeMatch(recipe, inventory));

  // Sort by match percentage (descending)
  return suggestedRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Generate explanatory text for meal suggestion
 */
function generateMealExplanation(recipe: Recipe, matchPercentage: number): string {
  if (matchPercentage === 100) {
    return `${recipe.name} pode ser feita com seus ingredientes disponíveis agora! Perfeito para essa hora do dia.`;
  } else if (matchPercentage >= 75) {
    return `${recipe.name} é uma ótima opção! Você tem a maioria dos ingredientes.`;
  } else if (matchPercentage >= 50) {
    return `${recipe.name} pode ser adaptada com ingredientes que você tem. Faltam alguns itens.`;
  } else {
    return `${recipe.name} requer ingredientes adicionais, mas pode ser uma boa inspiração!`;
  }
}

/**
 * Filter recipes by difficulty and prep time
 */
export function filterRecipesByConstraints(
  recipes: Recipe[],
  maxPrepTime?: number,
  difficulty?: 'easy' | 'medium' | 'hard',
): Recipe[] {
  return recipes.filter(
    (recipe) =>
      (!maxPrepTime || recipe.preparationTime <= maxPrepTime) &&
      (!difficulty || recipe.difficulty === difficulty),
  );
}

/**
 * Search recipes by ingredients
 */
export function searchRecipesByIngredients(recipes: Recipe[], ingredients: string[]): Recipe[] {
  return recipes.filter((recipe) => {
    const recipeIngredientsLower = recipe.ingredients.map((i) => i.name.toLowerCase());
    return ingredients.some((ingredient) =>
      recipeIngredientsLower.some((ri) => ri.includes(ingredient.toLowerCase())),
    );
  });
}

/**
 * Get recipes by tags/categories
 */
export function getRecipesByTags(recipes: Recipe[], tags: string[]): Recipe[] {
  return recipes.filter((recipe) => tags.some((tag) => recipe.tags.includes(tag)));
}

/**
 * Rate a recipe based on user interaction
 */
export function rateRecipe(recipe: Recipe, rating: number): Recipe {
  return {
    ...recipe,
    rating: Math.round((recipe.rating || 0) * 0.7 + rating * 0.3),
  };
}

/**
 * Generate ICMS category codes for items
 */
export const ICMS_CATEGORIES = {
  BR0201: { name: 'Carnes', rate: 0.12, description: 'Carne bovina e suína' },
  BR0202: { name: 'Aves', rate: 0.12, description: 'Frango, peru, aves' },
  BR0203: { name: 'Peixes', rate: 0.12, description: 'Peixes e frutos do mar' },
  BR0301: { name: 'Laticínios', rate: 0.0, description: 'Leite, queijo, manteiga' },
  BR0401: { name: 'Frutas', rate: 0.0, description: 'Frutas frescas' },
  BR0402: { name: 'Vegetais', rate: 0.0, description: 'Legumes e verduras' },
  BR0501: { name: 'Alimentos Processados', rate: 0.07, description: 'Alimentos processados' },
};

/**
 * Calculate ICMS credit potential for items
 */
export function calculateICMSCredit(
  itemName: string,
  itemPrice: number,
  categoryCode: string,
  state: string,
): {
  applicable: boolean;
  rate: number;
  creditAmount: number;
  reason: string;
} {
  const category = ICMS_CATEGORIES[categoryCode as keyof typeof ICMS_CATEGORIES];

  if (!category) {
    return {
      applicable: false,
      rate: 0,
      creditAmount: 0,
      reason: 'Categoria não encontrada',
    };
  }

  if (category.rate === 0) {
    return {
      applicable: true,
      rate: 0,
      creditAmount: 0,
      reason: 'Produto isento de ICMS (alimentos básicos)',
    };
  }

  // Different rates by state
  const stateRates: Record<string, number> = {
    SP: 0.18,
    RJ: 0.2,
    MG: 0.15,
    BA: 0.17,
    SC: 0.12,
    RS: 0.12,
  };

  const rate = stateRates[state] || 0.17;
  const creditAmount = itemPrice * rate * category.rate;

  return {
    applicable: true,
    rate,
    creditAmount,
    reason: `ICMS passível de creditamento em ${state}`,
  };
}
