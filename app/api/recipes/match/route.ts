// API Route: POST /api/recipes/match
// Calculate recipe matches based on inventory

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inventory, mealType } = body;

    if (!Array.isArray(inventory)) {
      return new Response(
        JSON.stringify({ error: 'Inventory must be an array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Mock recipe database
    const mockRecipes = [
      {
        id: '1',
        name: 'Frittata de Legumes',
        mealType: 'lunch',
        difficulty: 'easy',
        prepTime: 15,
        ingredients: ['Ovos', 'Brócolis', 'Tomate', 'Cebola', 'Alho'],
      },
      {
        id: '2',
        name: 'Arroz com Frango',
        mealType: 'lunch',
        difficulty: 'easy',
        prepTime: 25,
        ingredients: ['Arroz', 'Frango', 'Cebola', 'Alho', 'Tomate'],
      },
      {
        id: '3',
        name: 'Pasta Alho e Óleo',
        mealType: 'dinner',
        difficulty: 'easy',
        prepTime: 12,
        ingredients: ['Massa', 'Alho', 'Azeite', 'Pimenta'],
      },
    ];

    // Calculate matches
    const inventoryNames = inventory.map((item: any) => item.name.toLowerCase());

    const matched = mockRecipes
      .map((recipe) => {
        const matchedIngredients = recipe.ingredients.filter((ing) =>
          inventoryNames.some((invItem) => invItem.includes(ing.toLowerCase())),
        );

        const matchPercentage = Math.round(
          (matchedIngredients.length / recipe.ingredients.length) * 100,
        );

        return {
          ...recipe,
          matchPercentage,
          matchedIngredients: matchedIngredients.length,
          missingIngredients: recipe.ingredients.filter(
            (ing) =>
              !inventoryNames.some((invItem) => invItem.includes(ing.toLowerCase())),
          ),
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return new Response(
      JSON.stringify({
        recipes: matched,
        totalMatches: matched.length,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Recipe match API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
