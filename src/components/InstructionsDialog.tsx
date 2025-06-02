
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const InstructionsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Info className="h-4 w-4" />
          Navodila
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kako igrati puzzle</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 Cilj igre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Sestavite sliko knjige iz posameznih kosov. Kosse lahko premikate z vlečenjem in obračate s klikom.</p>
              <p>Ko postavite kos na pravo mesto z pravilno orientacijo, se obarva zeleno in se zaklepa na mestu.</p>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎮 Kontrole</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">🖱️ Miška/Tipkovnica</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Vlečenje: Premikaj kose</li>
                    <li>• Klik: Obrni kos za 90°</li>
                  </ul>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold mb-2">📱 Dotik</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Vlečenje: Premikaj kose</li>
                    <li>• Dotik: Obrni kos za 90°</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring System */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🏆 Sistem točkovanja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Maksimalne točke po težavnostih:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>2×2: 100 točk</div>
                  <div>2×3: 200 točk</div>
                  <div>3×3: 400 točk</div>
                  <div>3×4: 800 točk</div>
                  <div>4×4: 1600 točk</div>
                  <div>4×5: 3200 točk</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Časovne meje:</h4>
                <p className="text-sm">Če rešite puzzle v časovni meji, dobite polne točke. Če presežete čas, se točke zmanjšujejo eksponentno.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Rangi:</h4>
                <div className="flex gap-4 text-sm">
                  <span>🥇 Zlat: 100%</span>
                  <span>🥈 Srebrn: ≥60%</span>
                  <span>🥉 Bronast: ≥30%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Nasveti</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Začnite z vogalnimi in robnimi kosi</li>
                <li>• Uporabite gumb "Prikaži rešitev" za pomoč</li>
                <li>• Kosse obračajte s klikom, dokler niso v pravi orientaciji</li>
                <li>• Zeleni rob pomeni, da je kos pravilno postavljen</li>
                <li>• Hitrost rešitve vpliva na končno oceno</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
