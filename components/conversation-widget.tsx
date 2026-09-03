'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ConversationWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Olá! Sou o seu assistente do Bento. Posso ajudá-lo com sugestões de receitas, informações sobre créditos ICMS e as últimas notícias da câmara municipal. Como posso ajudá-lo hoje?',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    // Simulate API response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Entendi que você quer saber sobre "${input}". Com base no seu inventário, tenho algumas ótimas sugestões para você. Posso também compartilhar as notícias recentes da câmara municipal enquanto você prepara sua refeição.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Messages Container */}
      <Card className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-card rounded-xl">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg rounded-bl-none">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </Card>

      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pergunte qualquer coisa..."
            className="flex-1 rounded-lg border-border bg-background"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isSending}
            className="bg-primary hover:bg-primary/90 text-white rounded-lg px-3"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={() => setIsListening(!isListening)}
          variant={isListening ? 'default' : 'outline'}
          className={`w-full rounded-lg gap-2 ${
            isListening ? 'bg-accent hover:bg-accent/90 text-white' : ''
          }`}
        >
          <Mic className="w-4 h-4" />
          {isListening ? 'Ouvindo...' : 'Ativar Voz'}
        </Button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-lg"
            onClick={() => setInput('Quais receitas posso fazer agora?')}
          >
            Receitas Agora
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-lg"
            onClick={() => setInput('Quais créditos ICMS tenho?')}
          >
            Meus Créditos
          </Button>
        </div>
      </div>
    </div>
  );
}
