'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Clock, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RecipeDetail {
  id: string;
  name: string;
  servings: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    available: boolean;
    optional?: boolean;
  }>;
  instructions: Array<{
    step: number;
    instruction: string;
    duration?: number;
    newsRelated?: string;
  }>;
}

interface RecipeCookingPageProps {
  recipe?: RecipeDetail;
}

export default function RecipeCookingPage({ recipe }: RecipeCookingPageProps) {
  const defaultRecipe: RecipeDetail = {
    id: '1',
    name: 'Frittata de Legumes',
    servings: 4,
    prepTime: 15,
    difficulty: 'easy',
    ingredients: [
      { name: 'Ovos', quantity: 6, unit: 'un', available: true },
      { name: 'Brócolis', quantity: 200, unit: 'g', available: true },
      { name: 'Tomate', quantity: 2, unit: 'un', available: true },
      { name: 'Cebola', quantity: 1, unit: 'un', available: true },
      { name: 'Alho', quantity: 2, unit: 'dentes', available: true },
      { name: 'Queijo Ralado', quantity: 100, unit: 'g', available: false, optional: true },
      { name: 'Azeite', quantity: 3, unit: 'colheres', available: true },
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Pré-aqueça o forno a 190°C.',
        duration: 5,
      },
      {
        step: 2,
        instruction: 'Pique a cebola e o alho, refogue no azeite até dourar.',
        duration: 3,
        newsRelated: 'Câmara aprova Lei de Segurança Alimentar',
      },
      {
        step: 3,
        instruction: 'Adicione o brócolis picado e o tomate. Cozinhe por 5 minutos.',
        duration: 5,
      },
      {
        step: 4,
        instruction: 'Em uma tigela, bata os ovos com sal, pimenta e queijo (se tiver).',
        duration: 3,
      },
      {
        step: 5,
        instruction: 'Despeje os ovos sobre os legumes na panela.',
        duration: 2,
        newsRelated: 'Debate sobre regulação de restaurantes é agendado',
      },
      {
        step: 6,
        instruction: 'Leve ao forno por 6-8 minutos até firmar.',
        duration: 7,
      },
    ],
  };

  const displayRecipe = recipe || defaultRecipe;
  const [currentStep, setCurrentStep] = useState(1);
  const [voiceActive, setVoiceActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const markStepComplete = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step],
    );
    if (step < displayRecipe.instructions.length) {
      setCurrentStep(step + 1);
    }
  };

  const getTimeRemaining = () => {
    const remaining = displayRecipe.instructions.reduce((sum, instr) => {
      return sum + (instr.duration || 0);
    }, 0);
    return remaining;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/30 pb-20">
      {/* Header with Timer */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{displayRecipe.name}</h1>
            <p className="text-xs text-muted-foreground">Passo {currentStep} de {displayRecipe.instructions.length}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{getTimeRemaining()}min</div>
            <p className="text-xs text-muted-foreground">restante</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Recipe Info */}
        <Card className="p-4 bg-card rounded-xl border-border">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{displayRecipe.prepTime}min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{displayRecipe.servings} porções</span>
            </div>
            <Badge
              className={`text-xs ${
                displayRecipe.difficulty === 'easy'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : displayRecipe.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {displayRecipe.difficulty === 'easy'
                ? 'Fácil'
                : displayRecipe.difficulty === 'medium'
                  ? 'Médio'
                  : 'Difícil'}
            </Badge>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructions">Modo Preparo</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
          </TabsList>

          {/* Instructions Tab */}
          <TabsContent value="instructions" className="space-y-4 mt-4">
            <div className="space-y-3">
              {displayRecipe.instructions.map((instr, idx) => (
                <Card
                  key={idx}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    currentStep === instr.step
                      ? 'border-primary bg-primary/5'
                      : completedSteps.includes(instr.step)
                        ? 'border-green-500/30 bg-green-50 dark:bg-green-950/20'
                        : 'border-border'
                  }`}
                  onClick={() => setCurrentStep(instr.step)}
                >
                  <div className="flex gap-4">
                    {/* Step Indicator */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          completedSteps.includes(instr.step)
                            ? 'bg-green-500 text-white'
                            : currentStep === instr.step
                              ? 'bg-primary text-white'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {completedSteps.includes(instr.step) ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          instr.step
                        )}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight mb-2">
                        {instr.instruction}
                      </p>

                      {instr.duration && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <Clock className="w-3.5 h-3.5" />
                          {instr.duration} minutos
                        </div>
                      )}

                      {instr.newsRelated && currentStep === instr.step && (
                        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 p-3 rounded-lg mb-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                                Notícia Relacionada
                              </p>
                              <p className="text-xs text-blue-800 dark:text-blue-300 mt-1">
                                {instr.newsRelated}
                              </p>
                            </div>
                          </div>
                        </Card>
                      )}

                      {currentStep === instr.step && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => markStepComplete(instr.step)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Passo Completo
                          </Button>
                          <Button
                            onClick={() => setVoiceActive(!voiceActive)}
                            variant={voiceActive ? 'default' : 'outline'}
                            className="rounded-lg"
                            size="icon"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Progress */}
            <Card className="p-4 bg-card rounded-xl">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm font-bold text-primary">
                    {completedSteps.length}/{displayRecipe.instructions.length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{
                      width: `${(completedSteps.length / displayRecipe.instructions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Ingredients Tab */}
          <TabsContent value="ingredients" className="space-y-3 mt-4">
            {displayRecipe.ingredients.map((ing, idx) => (
              <Card key={idx} className="p-4 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{ing.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {ing.quantity} {ing.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ing.available ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                    {ing.optional && (
                      <Badge variant="outline" className="text-xs">
                        Opcional
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
