'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Type, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecognizedItem {
  name: string;
  quantity: number;
  confidence: number;
  icmsInfo?: {
    state: string;
    rate: number;
    creditPotential: number;
  };
}

export default function ReceiptScanner() {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [recognizedItems, setRecognizedItems] = useState<RecognizedItem[]>([
    {
      name: 'Tomate',
      quantity: 2,
      confidence: 98,
      icmsInfo: { state: 'SP', rate: 0, creditPotential: 0 },
    },
    {
      name: 'Alface',
      quantity: 1,
      confidence: 95,
      icmsInfo: { state: 'SP', rate: 0, creditPotential: 0 },
    },
    {
      name: 'Frango Integral',
      quantity: 1.5,
      confidence: 92,
      icmsInfo: { state: 'SP', rate: 12, creditPotential: 5.4 },
    },
  ]);

  const totalICMSPotential = recognizedItems.reduce(
    (sum, item) => sum + (item.icmsInfo?.creditPotential || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="camera" onValueChange={(v) => setScanMode(v as 'camera' | 'manual')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">
            <Camera className="w-4 h-4 mr-2" />
            Câmera
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Type className="w-4 h-4 mr-2" />
            Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="space-y-4 mt-4">
          <Card className="bg-muted p-8 rounded-xl flex flex-col items-center justify-center min-h-64 gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-1">Fotografar Recibo</h3>
              <p className="text-sm text-muted-foreground">
                Aponte a câmera para o recibo do mercado
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg">
              Abrir Câmera
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4 mt-4">
          <Card className="p-4 bg-card">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Selecionar Loja</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background">
                  <option>Carrefour - Consolação</option>
                  <option>Pão de Açúcar - Av. Paulista</option>
                  <option>Sonda - Vila Mariana</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Digite os itens</label>
                <textarea
                  placeholder="Ex: Tomate 2kg, Frango 1.5kg..."
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background min-h-24"
                />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold">
                Analisar Itens
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recognized Items */}
      {recognizedItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Itens Identificados</h3>

          {/* ICMS Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Potencial de Crédito ICMS</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  R$ {totalICMSPotential.toFixed(2)}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          {/* Items List */}
          <div className="space-y-2">
            {recognizedItems.map((item, idx) => (
              <Card key={idx} className="p-3 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      {item.quantity}un
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {item.confidence}% confiança
                    </span>
                  </div>

                  {item.icmsInfo && item.icmsInfo.creditPotential > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Crédito ICMS: R$ {item.icmsInfo.creditPotential.toFixed(2)}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" className="rounded-lg">
              Editar
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold">
              Adicionar ao Inventário
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
