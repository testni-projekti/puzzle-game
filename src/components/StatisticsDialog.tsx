
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3, Trophy, Clock, HelpCircle, TrendingDown } from 'lucide-react';
import { GameStorage } from '@/utils/gameStorage';

export const StatisticsDialog: React.FC = () => {
  const globalStats = GameStorage.getGlobalStatistics();
  const allResults = GameStorage.getAllResults();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankEmoji = (rank: string) => {
    switch (rank) {
      case 'zlata medalja': return '🥇';
      case 'srebrna medalja': return '🥈';
      case 'bronasta medalja': return '🥉';
      default: return '📊';
    }
  };

  const gridSizes = [
    [2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5]
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-blue-200 text-blue-700 hover:border-blue-300 transition-all duration-200 rounded-xl shadow-sm"
        >
          <BarChart3 className="h-5 w-5" />
          Statistika
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            📊 Statistika iger
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Globalna statistika */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Skupna statistika
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-white/70 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{globalStats.totalGames}</div>
                <div className="text-sm text-gray-600">Odigrane igre</div>
              </div>
              <div className="text-center bg-white/70 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">{globalStats.totalPoints}</div>
                <div className="text-sm text-gray-600">Skupaj točk</div>
              </div>
              <div className="text-center bg-white/70 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-600">{formatTime(globalStats.averageTime)}</div>
                <div className="text-sm text-gray-600">Povprečni čas</div>
              </div>
              <div className="text-center bg-white/70 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">{globalStats.totalHintsUsed}</div>
                <div className="text-sm text-gray-600">Uporabljene pomoči</div>
              </div>
            </div>
            
            {globalStats.totalPointsLostToHints > 0 && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-orange-700">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">Izgubljene točke zaradi pomoči: {globalStats.totalPointsLostToHints}</span>
                </div>
                <div className="text-sm text-orange-600 mt-1">
                  To predstavlja {Math.round((globalStats.totalPointsLostToHints / (globalStats.totalPoints + globalStats.totalPointsLostToHints)) * 100)}% vseh možnih točk
                </div>
              </div>
            )}
          </div>

          {/* Statistika po težavnostih */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <h3 className="text-xl font-bold text-gray-800 p-6 pb-4 border-b">
              Statistika po težavnostih
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {gridSizes.map(([rows, cols]) => {
                const stats = GameStorage.getStatistics(rows, cols);
                if (stats.totalGames === 0) return null;
                
                return (
                  <div key={`${rows}x${cols}`} className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-bold text-lg text-gray-800 mb-3 text-center">
                      {rows}×{cols}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Igre:</span>
                        <span className="font-semibold">{stats.totalGames}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Najboljši:</span>
                        <span className="font-semibold text-green-600">{stats.best}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Povprečje:</span>
                        <span className="font-semibold">{stats.average}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Povp. čas:</span>
                        <span className="font-semibold">{formatTime(stats.averageTime)}</span>
                      </div>
                      {stats.totalHintsUsed > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pomoči:</span>
                          <span className="font-semibold text-orange-600">{stats.totalHintsUsed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Zadnje igre */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <h3 className="text-xl font-bold text-gray-800 p-6 pb-4 border-b">
              Zadnje igre
            </h3>
            <div className="max-h-64 overflow-y-auto">
              {allResults.slice(0, 10).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getRankEmoji(result.rank)}</span>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {result.grid} - {result.points} točk
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTime(result.time)} • {new Date(result.date).toLocaleDateString('sl-SI')}
                      </div>
                      {result.hintsUsed > 0 && (
                        <div className="text-xs text-orange-600">
                          {result.hintsUsed} pomoč(i) • -{result.pointsLostToHints} točk
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-800">{result.rank}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Nasvet:</p>
                <p>Uporaba funkcije "Prikaži rešitev" zmanjša točke za 10% od maksimalnih možnih točk za to težavnost.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
