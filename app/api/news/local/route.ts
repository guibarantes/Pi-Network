// API Route: GET /api/news/local
// Fetch local news for a specific municipality

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const municipality = searchParams.get('municipality') || 'São Paulo';
    const state = searchParams.get('state') || 'SP';
    const category = searchParams.get('category');

    // Mock news data - in production, would fetch from actual news sources
    const mockNews = [
      {
        id: '1',
        title: 'Câmara aprova Lei de Segurança Alimentar',
        description:
          'Projeto que garante subsídios para produtos de primeira necessidade nos mercados municipais foi aprovado por unanimidade.',
        content:
          'A câmara municipal aprovou hoje a Lei de Segurança Alimentar que estabelece subsídios para frutas, vegetais e proteínas em mercados públicos...',
        municipality: 'São Paulo',
        state: 'SP',
        category: 'legislation',
        sourceUrl: 'https://example.com/news/1',
        publishedDate: new Date(Date.now() - 3600000).toISOString(),
        relevanceScore: 0.95,
      },
      {
        id: '2',
        title: 'Debate sobre regulação de restaurantes é agendado',
        description:
          'Vereadores discutirão novas normas para funcionamento de estabelecimentos gastronômicos na zona central.',
        content: 'A comissão de Desenvolvimento Econômico agendou debate sobre novas regulações...',
        municipality: 'São Paulo',
        state: 'SP',
        category: 'politics',
        sourceUrl: 'https://example.com/news/2',
        publishedDate: new Date(Date.now() - 7200000).toISOString(),
        relevanceScore: 0.85,
      },
      {
        id: '3',
        title: 'Orçamento 2025 inclui investimento em agricultura urbana',
        description:
          'R$ 2 milhões destinados para programas de hortas comunitárias em todos os distritos da cidade.',
        content:
          'O orçamento municipal para 2025 foi aprovado com inclusão de R$ 2 milhões para agricultura urbana...',
        municipality: 'São Paulo',
        state: 'SP',
        category: 'budget',
        sourceUrl: 'https://example.com/news/3',
        publishedDate: new Date(Date.now() - 10800000).toISOString(),
        relevanceScore: 0.78,
      },
      {
        id: '4',
        title: 'Reforma de mercado público é iniciada',
        description:
          'Começam as obras de modernização do mercado central. Impacto na venda de alimentos frescos esperado.',
        content: 'A prefeitura iniciou as obras de reforma do mercado central da cidade...',
        municipality: 'São Paulo',
        state: 'SP',
        category: 'public_works',
        sourceUrl: 'https://example.com/news/4',
        publishedDate: new Date(Date.now() - 86400000).toISOString(),
        relevanceScore: 0.72,
      },
    ];

    // Filter by category if provided
    let filtered = mockNews;
    if (category) {
      filtered = filtered.filter((news) => news.category === category);
    }

    // Filter by municipality and state
    filtered = filtered.filter(
      (news) => news.municipality === municipality && news.state === state,
    );

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
    );

    return new Response(
      JSON.stringify({
        municipality,
        state,
        news: filtered,
        total: filtered.length,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('News API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
