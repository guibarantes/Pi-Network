// API Route: POST /api/chat
// Handle chat message requests

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context, userId } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // TODO: In production, integrate with AI service
    // Example: const response = await openai.createChatCompletion({ ... })
    // For now, return mock response

    const contexts = ['recipe', 'local_politics', 'general', 'icms'];
    const selectedContext = contexts.includes(context) ? context : 'general';

    const mockResponses: Record<string, string> = {
      recipe: `Entendi que você está interessado em receitas. Com base no seu inventário atual, posso sugerir pratos rápidos e fáceis de preparar. Qual tipo de receita você prefere?`,
      local_politics: `Ótimo, você quer saber sobre notícias políticas locais. Temos atualizações recentes da câmara municipal. A votação sobre segurança alimentar acontece em breve.`,
      icms: `Você quer informações sobre créditos ICMS. Analisando seus últimos recibos, identifiquei potencial de R$ 145,50 em créditos em SP.`,
      general: `Como posso ajudá-lo? Posso sugerir receitas, compartilhar notícias locais ou calcular seus créditos ICMS.`,
    };

    return new Response(
      JSON.stringify({
        id: Date.now().toString(),
        content: mockResponses[selectedContext],
        context: selectedContext,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
