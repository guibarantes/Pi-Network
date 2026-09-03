'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Flame } from 'lucide-react';

interface MealSuggestion {
  id: string;
  name: string;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  matchPercentage: number;
  image?: string;
  missingItems: number;
}

export default function QuickMealSuggestions() {
  const suggestions: MealSuggestion[] = [
    {
      id: '1',
      name: 'Frittata de Legumes',
      prepTime: 15,
      difficulty: 'easy',
      matchPercentage: 95,
      image: '/placeholder.svg?height=180&width=160',
      missingItems: 1,
    },
    {
      id: '2',
      name: 'Arroz com Brócolis',
      prepTime: 25,
      difficulty: 'easy',
      matchPercentage: 88,
      image: '/placeholder.svg?height=180&width=160',
      missingItems: 0,
    },
    {
      id: '3',
      name: 'Pasta Alho e Óleo',
      prepTime: 12,
      difficulty: 'easy',
      matchPercentage: 82,
      image: '/placeholder.svg?height=180&width=160',
      missingItems: 2,
    },
  ];

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm px-1">Sugestões para Agora</h3>
      <div className="space-y-3">
        {suggestions.map((meal) => (
          <Card
            key={meal.id}
            className="p-4 hover:shadow-md transition-shadow cursor-pointer border-border"
          >
            <div className="flex gap-4">
              {/* Meal Image */}
              <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meal Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm leading-tight">{meal.name}</h4>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-accent">{meal.matchPercentage}%</div>
                    <div className="text-xs text-muted-foreground">compatível</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {meal.prepTime}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    {meal.difficulty === 'easy' && 'Fácil'}
                    {meal.difficulty === 'medium' && 'Médio'}
                    {meal.difficulty === 'hard' && 'Difícil'}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    Vegano
                  </Badge>
                  {meal.missingItems > 0 && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${difficultyColor[meal.difficulty]}`}
                    >
                      +{meal.missingItems} item
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold">
        Ver mais receitas
      </Button>
    </div>
  );
}
