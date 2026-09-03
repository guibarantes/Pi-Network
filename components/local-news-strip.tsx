'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, MapPin } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'legislation' | 'politics' | 'budget' | 'public_works';
  municipality: string;
  source: string;
  date: Date;
  impact: 'high' | 'medium' | 'low';
}

export default function LocalNewsStrip() {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Câmara aprova Lei de Segurança Alimentar',
      summary:
        'Projeto que garante subsídios para produtos de primeira necessidade nos mercados municipais foi aprovado por unanimidade.',
      category: 'legislation',
      municipality: 'São Paulo',
      source: 'Câmara Municipal',
      date: new Date(Date.now() - 3600000),
      impact: 'high',
    },
    {
      id: '2',
      title: 'Debate sobre regulação de restaurantes é agendado',
      summary:
        'Vereadores discutirão novas normas para funcionamento de estabelecimentos gastronômicos na zona central.',
      category: 'politics',
      municipality: 'São Paulo',
      source: 'Câmara Municipal',
      date: new Date(Date.now() - 7200000),
      impact: 'medium',
    },
    {
      id: '3',
      title: 'Orçamento 2025 inclui investimento em agricultura urbana',
      summary:
        'R$ 2 milhões destinados para programas de hortas comunitárias em todos os distritos da cidade.',
      category: 'budget',
      municipality: 'São Paulo',
      source: 'Prefeitura',
      date: new Date(Date.now() - 10800000),
      impact: 'medium',
    },
  ];

  const getCategoryColor = (
    category: 'legislation' | 'politics' | 'budget' | 'public_works',
  ) => {
    switch (category) {
      case 'legislation':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'politics':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'budget':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'public_works':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: 'legislation' | 'politics' | 'budget' | 'public_works') => {
    switch (category) {
      case 'legislation':
        return 'Legislação';
      case 'politics':
        return 'Política';
      case 'budget':
        return 'Orçamento';
      case 'public_works':
        return 'Obras Públicas';
      default:
        return category;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-semibold">Notícias Locais - São Paulo</h2>
        <Badge variant="outline" className="text-xs">
          <MapPin className="w-3 h-3 mr-1" />
          Em foco
        </Badge>
      </div>

      <div className="space-y-3">
        {newsItems.map((news) => (
          <Card
            key={news.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer border-border"
          >
            <div className="flex gap-3">
              {/* Impact Indicator */}
              <div className="flex-shrink-0 pt-1">
                <div
                  className={`w-2 h-12 rounded-full ${
                    news.impact === 'high'
                      ? 'bg-red-500'
                      : news.impact === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                  }`}
                />
              </div>

              {/* News Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {news.title}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                    {getTimeAgo(news.date)}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {news.summary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getCategoryColor(news.category)}`}>
                      {getCategoryLabel(news.category)}
                    </Badge>
                    {news.impact === 'high' && (
                      <Badge
                        variant="outline"
                        className="text-xs gap-1 border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                      >
                        <AlertCircle className="w-3 h-3" />
                        Impacto Alto
                      </Badge>
                    )}
                  </div>
                  {news.impact === 'high' && (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="bg-card border-border p-4 rounded-xl mt-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Acompanhamento Local</h4>
            <p className="text-xs text-muted-foreground">
              Essas notícias são selecionadas automaticamente enquanto você prepara sua refeição durante
              as votações da câmara.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
