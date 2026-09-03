// API Route: POST /api/icms/analyze
// Analyze receipt items for ICMS credit potential

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, state } = body;

    if (!Array.isArray(items) || !state) {
      return new Response(
        JSON.stringify({ error: 'Items array and state are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // ICMS rates by category and state
    const icmsRates: Record<string, Record<string, number>> = {
      SP: {
        'Carnes': 0.12,
        'Aves': 0.12,
        'Peixes': 0.12,
        'Laticínios': 0.0,
        'Frutas': 0.0,
        'Vegetais': 0.0,
        'Alimentos Processados': 0.07,
      },
      RJ: {
        'Carnes': 0.15,
        'Aves': 0.15,
        'Peixes': 0.15,
        'Laticínios': 0.0,
        'Frutas': 0.0,
        'Vegetais': 0.0,
        'Alimentos Processados': 0.08,
      },
      MG: {
        'Carnes': 0.1,
        'Aves': 0.1,
        'Peixes': 0.1,
        'Laticínios': 0.0,
        'Frutas': 0.0,
        'Vegetais': 0.0,
        'Alimentos Processados': 0.06,
      },
    };

    const stateRates = icmsRates[state as keyof typeof icmsRates] || icmsRates.SP;

    // Analyze each item
    const analyzedItems = items.map((item: any) => {
      const { name, price, category } = item;
      const rate = stateRates[category as keyof typeof stateRates] || 0;
      const creditAmount = price * rate;

      return {
        name,
        price,
        category,
        rate,
        creditAmount,
        applicable: rate > 0,
      };
    });

    // Calculate totals
    const totalCredit = analyzedItems.reduce((sum: number, item: any) => sum + item.creditAmount, 0);
    const applicableItems = analyzedItems.filter((item: any) => item.applicable).length;

    return new Response(
      JSON.stringify({
        state,
        items: analyzedItems,
        summary: {
          totalCredit: totalCredit.toFixed(2),
          applicableItems,
          totalItems: items.length,
        },
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('ICMS analysis API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
