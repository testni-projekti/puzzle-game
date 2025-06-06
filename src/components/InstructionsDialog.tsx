
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const InstructionsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-purple-200 text-purple-700 hover:border-purple-300 transition-all duration-200 rounded-xl shadow-sm"
        >
          <HelpCircle className="h-5 w-5" />
          Navodila
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            📖 Navodila za igranje
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Osnove igre */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
              🎯 Cilj igre
            </h3>
            <p className="text-blue-700 leading-relaxed">
              Sestavite puzzle iz delčkov naslovnice knjige. Ko uspešno sestavite puzzle, 
              boste izvedeli več o knjigi in dobili možnost, da jo poiščete v COBISS sistemu.
            </p>
          </div>

          {/* Kako igrati */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              🎮 Kako igrati
            </h3>
            <div className="space-y-3 text-green-700">
              <div className="flex items-start gap-3">
                <span className="text-lg">🖱️</span>
                <div>
                  <p className="font-semibold">Premikanje delčkov:</p>
                  <p>Povlecite delček puzzle z miško ali dotikom na želeno mesto.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-lg">🔄</span>
                <div>
                  <p className="font-semibold">Obračanje delčkov:</p>
                  <p>Kliknite enkrat na delček, da ga obrnete za 90°.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="font-semibold">Postavljanje delčkov:</p>
                  <p>Delčki se samodejno prilepijo na pravilno mesto, ko so dovolj blizu.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Težavnosti */}
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              ⚡ Težavnosti
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                <p className="font-semibold text-purple-800">2×2 (Zelo lahko)</p>
                <p className="text-purple-600">4 delčki</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                <p className="font-semibold text-purple-800">2×3 (Lahko)</p>
                <p className="text-purple-600">6 delčkov</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                <p className="font-semibold text-purple-800">3×3 (Srednje)</p>
                <p className="text-purple-600">9 delčkov</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                <p className="font-semibold text-purple-800">3×4 (Težje)</p>
                <p className="text-purple-600">12 delčkov</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                <p className="font-semibold text-purple-800">4×4 (Težko)</p>
                <p className="text-purple-600">16 delčkov</p>
              </div>
              <div className="bg-white/70 rounded-lg p-3 border border-purple-200">
                <p className="font-semibold text-purple-800">4×5 (Zelo težko)</p>
                <p className="text-purple-600">20 delčkov</p>
              </div>
            </div>
          </div>

          {/* Točkovanje */}
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
              🏆 Točkovanje in rangi
            </h3>
            <div className="space-y-3 text-yellow-700">
              <p>Točke dobite glede na:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Težavnost puzzle (več delčkov = več točk)</li>
                <li>Hitrost reševanja (hitrejše = več točk)</li>
                <li>Uporaba pomoči (zmanjša točke za 10%)</li>
              </ul>
              
              <div className="mt-4 space-y-2">
                <p className="font-semibold">Rangi:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div className="bg-yellow-100 rounded p-2 text-center border">
                    <span className="text-lg">🥇</span>
                    <p className="font-semibold">Zlata medalja</p>
                    <p>90-100 točk</p>
                  </div>
                  <div className="bg-gray-100 rounded p-2 text-center border">
                    <span className="text-lg">🥈</span>
                    <p className="font-semibold">Srebrna medalja</p>
                    <p>70-89 točk</p>
                  </div>
                  <div className="bg-orange-100 rounded p-2 text-center border">
                    <span className="text-lg">🥉</span>
                    <p className="font-semibold">Bronasta medalja</p>
                    <p>50-69 točk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nasveti */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              💡 Nasveti za igranje
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Začnite z vogalnimi in robnimi delčki</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Uporabite funkcijo "Prikaži rešitev" le, če res potrebujete pomoč</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Pazljivo poglejte barve in vzorce na delčkih</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Vaja dela mojstra - igrajte različne težavnosti</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
