'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UtensilsCrossed, Camera, Brain, Mic, Newspaper, Settings } from 'lucide-react';
import QuickMealSuggestions from '@/components/quick-meal-suggestions';
import ReceiptScanner from '@/components/receipt-scanner';
import ConversationWidget from '@/components/conversation-widget';
import LocalNewsStrip from '@/components/local-news-strip';
import SettingsPage from '@/components/settings-page';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [userLocation] = useState({ state: 'SP', municipality: 'São Paulo' });
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/30 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bento</h1>
              <p className="text-xs text-muted-foreground">Refeições & Política Local</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block max-w-48 truncate text-xs text-muted-foreground">
              {user?.displayName || user?.email}
            </span>
          <Button variant="ghost" size="icon" aria-label="Abrir configurações" onClick={() => setActiveTab('settings')}>
            <Settings className="w-5 h-5" />
          </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="home" className="text-xs sm:text-sm">
              <UtensilsCrossed className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="receipt" className="text-xs sm:text-sm">
              <Camera className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Recibo</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs sm:text-sm">
              <Mic className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs sm:text-sm">
              <Newspaper className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Notícias</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Location Badge */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-muted-foreground">
                {userLocation.municipality}, {userLocation.state}
              </span>
            </div>

            {/* Current Time & Meal Suggestion */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-6 rounded-2xl">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg text-foreground">Bom almoço!</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Baseado no seu inventário, aqui estão as melhores opções para esta refeição.
                </p>
              </div>
            </Card>

            {/* Quick Meal Suggestions */}
            <QuickMealSuggestions />

            {/* Action Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-sm">Fotografar Itens</h3>
                  <p className="text-xs text-muted-foreground">Capture ingredientes</p>
                </div>
              </Card>

              <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm">Voz Ativa</h3>
                  <p className="text-xs text-muted-foreground">Início do preparo</p>
                </div>
              </Card>
            </div>

            {/* ICMS Credit Info */}
            <Card className="bg-card border border-border p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Créditos ICMS</h3>
                  <p className="text-xs text-muted-foreground">
                    Seus últimos recibos podem gerar até R$ 145 em créditos fiscais em SP.
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs mt-2">
                    Explorar →
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Receipt Tab */}
          <TabsContent value="receipt">
            <ReceiptScanner />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <ConversationWidget />
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <LocalNewsStrip />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
