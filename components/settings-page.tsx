'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Mic, MapPin, Zap, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function SettingsPage() {
  const { signOut, user } = useAuth();
  const [preferences, setPreferences] = useState({
    voiceEnabled: true,
    voiceLanguage: 'pt-BR',
    conversationFocus: 'local_politics',
    notificationsEnabled: true,
    mealReminders: true,
    newsAlerts: true,
    location: {
      state: 'SP',
      municipality: 'São Paulo',
    },
  });

  const handleToggle = (
    key: 'voiceEnabled' | 'notificationsEnabled' | 'mealReminders' | 'newsAlerts',
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/30 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Voice Settings */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            Assistente de Voz
          </h2>

          <Card className="p-4 space-y-4 border-border rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Ativar Assistente de Voz</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Receba instruções de voz durante o preparo
                </p>
              </div>
              <Switch checked={preferences.voiceEnabled} onChange={() => handleToggle('voiceEnabled')} />
            </div>

            {preferences.voiceEnabled && (
              <>
                <div className="border-t border-border pt-4">
                  <label className="text-sm font-medium block mb-2">Idioma da Voz</label>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg border-2 border-primary bg-primary/10 text-sm font-medium">
                      Português (Brasil)
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <label className="text-sm font-medium block mb-3">Assunto da Conversa</label>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg border border-border hover:border-primary bg-card text-sm">
                      Política Local
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg border border-border hover:border-primary bg-card text-sm">
                      Receitas & Culinária
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg border border-border hover:border-primary bg-card text-sm">
                      Educação Fiscal (ICMS)
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg border border-border hover:border-primary bg-card text-sm">
                      Tópico Misto
                    </button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </section>

        {/* Notifications */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Notificações
          </h2>

          <Card className="p-4 space-y-4 border-border rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Lembretes de Refeição</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Sugestões de receitas nos horários principais
                </p>
              </div>
              <Switch checked={preferences.mealReminders} onChange={() => handleToggle('mealReminders')} />
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Alertas de Notícias Locais</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Notificação sobre votações importantes
                </p>
              </div>
              <Switch checked={preferences.newsAlerts} onChange={() => handleToggle('newsAlerts')} />
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Permitir Notificações</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Notificações push do aplicativo
                </p>
              </div>
              <Switch checked={preferences.notificationsEnabled} onChange={() => handleToggle('notificationsEnabled')} />
            </div>
          </Card>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Localização
          </h2>

          <Card className="p-4 space-y-4 border-border rounded-xl">
            <div>
              <label className="text-sm font-medium block mb-2">Estado</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background">
                <option>São Paulo (SP)</option>
                <option>Rio de Janeiro (RJ)</option>
                <option>Minas Gerais (MG)</option>
                <option>Bahia (BA)</option>
                <option>Santa Catarina (SC)</option>
                <option>Rio Grande do Sul (RS)</option>
              </select>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-sm font-medium block mb-2">Município</label>
              <input
                type="text"
                placeholder="Digite seu município"
                defaultValue={preferences.location.municipality}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
              />
            </div>

            <div className="border-t border-border pt-4 flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 dark:text-blue-200">
                Sua localização é usada para sugerir receitas locais e mostrar notícias da câmara municipal.
              </p>
            </div>
          </Card>
        </section>

        {/* ICMS & Tax */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Educação Fiscal
          </h2>

          <Card className="p-4 space-y-4 border-border rounded-xl">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2">Seus Créditos ICMS Potenciais</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">R$ 145,50</p>
              <p className="text-xs text-muted-foreground mb-3">
                Baseado em análise de últimos 3 recibos em SP
              </p>
              <Button variant="outline" className="text-xs rounded-lg">
                Ver Detalhes
              </Button>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-sm mb-3">Método de Cálculo ICMS</h3>
              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  • Produtos alimentícios básicos (frutas, vegetais, leite) geralmente não geram
                  crédito
                </p>
                <p>
                  • Carnes, aves e outros produtos processados têm taxas específicas por estado
                </p>
                <p>• Seu assistente analisa cada recibo automaticamente</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Account */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">Conta</h2>

          <Card className="p-4 space-y-4 border-border rounded-xl">
            <div className="py-2">
              <h3 className="font-medium text-sm">{user?.displayName || 'Usuário Bento'}</h3>
              <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
            </div>

            <div className="border-t border-border" />
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-medium text-sm">Usuário Premium</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Acesso a todas as receitas e análises avançadas
                </p>
              </div>
              <Badge className="bg-primary/20 text-primary">Ativo</Badge>
            </div>

            <div className="border-t border-border pt-4">
              <Button
                variant="outline"
                className="w-full rounded-lg gap-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={() => void signOut()}
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground py-4">
          <p>Bento v1.0.0</p>
          <p className="mt-1">Seu assistente para refeições & política local</p>
        </div>
      </main>
    </div>
  );
}
