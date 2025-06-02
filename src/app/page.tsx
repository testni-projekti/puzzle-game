
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PuzzleGame } from '@/components/PuzzleGame';
import { BookInfo } from '@/components/BookInfo';
import { DifficultySelector } from '@/components/DifficultySelector';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { SettingsDialog } from '@/components/SettingsDialog';
import { StatisticsDialog } from '@/components/StatisticsDialog';
import { InstructionsDialog } from '@/components/InstructionsDialog';
import { BookOpen, PlayCircle, RotateCcw } from 'lucide-react';
import { BookCover } from '@/types/book';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from "@/components/ui/use-toast";
import { ScoreResult } from '@/utils/scoringSystem';
import { db, collection, getDocs } from '../../db/firebase_client.js';

type Difficulty = {
  cols: number;
  rows: number;
  label: string;
};

const DIFFICULTIES: Difficulty[] = [
  { cols: 2, rows: 2, label: "2×2 (Zelo lahko)" },
  { cols: 2, rows: 3, label: "2×3 (Lahko)" },
  { cols: 3, rows: 3, label: "3×3 (Srednje)" },
  { cols: 3, rows: 4, label: "3×4 (Težje)" },
  { cols: 4, rows: 4, label: "4×4 (Težko)" },
  { cols: 4, rows: 5, label: "4×5 (Zelo težko)" },
];

export default function Home() {
  const [currentBook, setCurrentBook] = useState<BookCover | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [finalScore, setFinalScore] = useState<ScoreResult | null>(null);
  const [completionTime, setCompletionTime] = useState(0);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    toast({
      title: "Nova igra",
      description: `Nova igra začeta z težavnostjo: ${selectedDifficulty.label}`,
    });
  };
  
  const handleGameComplete = (scoreResult: ScoreResult, gameTime: number) => {
    setGameCompleted(true);
    setFinalScore(scoreResult);
    setCompletionTime(gameTime);
    
    toast({
      title: "Čestitamo!",
      description: `Dosegil si ${scoreResult.points} točk in ${scoreResult.rank} rang!`,
    });
  };
  
  useEffect(() => {
    loadRandomBook();
  }, []);

  const loadRandomBook = async () => {
    try {
      const booksCollection = collection(db, 'books');
      const snapshot = await getDocs(booksCollection);
      const booksData = snapshot.docs.map(doc => doc.data());

      const random = Math.floor(Math.random() * booksData.length);
      const element = booksData[random];
      const realBook: BookCover = {
        title: element.title,
        author: element.author,
        coverUrl: element.image_url
      };

      setCurrentBook(realBook);
      setGameStarted(false);
      setGameCompleted(false);
      setLoading(false);
    } catch (error) {
      console.error('Error loading book:', error);
      setLoading(false);
    }
  };

  const playAgain = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" className="h-12 w-12" />
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Nalagam puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="container mx-auto max-w-7xl">
        {!gameStarted ? (
          // Start Screen - Modern responsive design
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] gap-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                COBISS Puzzle
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
                Sestavite sliko knjige iz posameznih kosov in preizkusite svojo spretnost!
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <StatisticsDialog />
              <InstructionsDialog />
              <SettingsDialog />
            </div>

            {/* Main Game Card */}
            <Card className="w-full max-w-5xl shadow-2xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
                  Izberite težavnost in začnite igro
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentBook ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Book Cover */}
                    <div className="flex justify-center">
                      <div className="relative group">
                        <img
                          src={currentBook.coverUrl} 
                          alt={currentBook.title} 
                          className="h-80 sm:h-96 object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                      </div>
                    </div>
                    
                    {/* Game Controls */}
                    <div className="space-y-6">
                      {/* Book Info */}
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-2 line-clamp-2" title={currentBook.title}>
                          {currentBook.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2" title={`Avtor: ${currentBook.author}`}>
                          Avtor: {currentBook.author}
                        </p>
                      </div>

                      {/* Difficulty Selector */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Izberite težavnost:</label>
                        <DifficultySelector 
                          difficulties={DIFFICULTIES}
                          selected={selectedDifficulty}
                          onChange={handleDifficultyChange}
                          className="w-full"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          onClick={startGame} 
                          disabled={!currentBook}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6 flex-1 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-xl"
                          size="lg"
                        >
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Začni igro
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={loadRandomBook}
                          className="bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 text-lg py-6 flex-1 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-xl"
                          size="lg"
                        >
                          <RotateCcw className="h-5 w-5 mr-2" />
                          Nova knjiga
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-red-500 text-lg">Napaka pri nalaganju knjige</p>
                    <Button onClick={loadRandomBook} className="mt-4">
                      Poskusi ponovno
                    </Button>
                  </div>
                )}
              </CardContent>
              {currentBook?.cobissUrl && (
                <CardFooter className="flex justify-center pt-6">
                  <Button 
                    variant="secondary"
                    onClick={() => window.open(currentBook.cobissUrl, '_blank')}
                    size={isMobile ? "lg" : "default"}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                  >
                    <BookOpen className="h-4 w-4" />
                    Odpri v COBISS Plus
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        ) : gameCompleted ? (
          // Completion Screen - Enhanced responsive design
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)] py-8">
            <Card className="w-full max-w-6xl shadow-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-200">
                  🎉 Čestitke!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Book Cover with Animation */}
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img 
                        src={currentBook?.coverUrl} 
                        alt={currentBook?.title || "Knjiga"} 
                        className="h-80 sm:h-96 object-contain rounded-lg shadow-xl animate-bounce group-hover:scale-105 transition-transform duration-300" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-200/20 to-transparent rounded-lg" />
                    </div>
                  </div>
                  
                  {/* Score and Stats */}
                  <div className="space-y-6">
                    {finalScore && (
                      <ScoreDisplay 
                        scoreResult={finalScore}
                        completionTime={completionTime}
                        rows={selectedDifficulty.rows}
                        cols={selectedDifficulty.cols}
                      />
                    )}
                    <BookInfo book={currentBook} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-center gap-4 pt-6">
                <Button 
                  onClick={playAgain}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 text-lg py-6 px-8 font-semibold rounded-xl shadow-lg"
                  size="lg"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Igraj ponovno
                </Button>
                {currentBook?.cobissUrl && (
                  <Button 
                    variant="secondary"
                    onClick={() => window.open(currentBook.cobissUrl, '_blank')}
                    size="lg"
                    className="hover:scale-105 transition-transform duration-300 text-lg py-6 px-8 font-semibold rounded-xl"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Odpri v COBISS Plus
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        ) : (
          // Game Screen - Fully responsive puzzle layout
          <div className="flex flex-col items-center min-h-[calc(100vh-2rem)] py-4 gap-6">
            <Card className="w-full max-w-7xl shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-center text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {selectedDifficulty.cols}×{selectedDifficulty.rows} Puzzle
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-8">
                {currentBook && (
                  <div className="w-full">
                    <PuzzleGame
                      imageSrc={currentBook.coverUrl}
                      rows={selectedDifficulty.rows}
                      cols={selectedDifficulty.cols}
                      onComplete={handleGameComplete}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={playAgain}
                  className="hover:scale-105 transition-all duration-300 px-8 py-3 text-base font-semibold rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600"
                  size="lg"
                >
                  ← Nazaj na izbiro težavnosti
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
