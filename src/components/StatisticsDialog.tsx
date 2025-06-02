
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameStorage } from '@/utils/gameStorage';
import { BarChart3 } from 'lucide-react';

export const StatisticsDialog: React.FC = () => {
  const allResults = GameStorage.getAllResults();
  const totalPoints = GameStorage.getTotalPoints();
  
  const gridSizes = [
    { label: '2×2', rows: 2, cols: 2 },
    { label: '2×3', rows: 2, cols: 3 },
    { label: '3×3', rows: 3, cols: 3 },
    { label: '3×4', rows: 3, cols: 4 },
    { label: '4×4', rows: 4, cols: 4 },
    { label: '4×5', rows: 4, cols: 5 },
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecentGames = () => {
    return allResults.slice(0, 5);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Statistika
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Statistika iger</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overall Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skupna statistika</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Skupne točke</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{allResults.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Odigrane igre</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {allResults.length > 0 ? Math.round(totalPoints / allResults.length) : 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Povprečne točke</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid Size Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistika po težavnostih</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gridSizes.map(({ label, rows, cols }) => {
                  const stats = GameStorage.getStatistics(rows, cols);
                  return (
                    <div key={label} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-center mb-3">{label}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>🏆 Najboljši:</span>
                          <span className="font-medium">{stats.best}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>📈 Povprečje:</span>
                          <span className="font-medium">{stats.average}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🎮 Igre:</span>
                          <span className="font-medium">{stats.totalGames}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Games */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zadnje igre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecentGames().map((game, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">{game.grid}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(game.time)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{game.points} točk</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600">
                        {game.rank}
                      </span>
                    </div>
                  </div>
                ))}
                {allResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Še nimate odigranih iger
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
