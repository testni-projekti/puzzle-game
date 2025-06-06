
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
import { BookOpen, RotateCcw } from 'lucide-react';
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

// Dodano za demo citati knjig
const bookQuotes: { [key: string]: string } = {
  "Kekec": "Kdor drugemu jamo koplje, sam vanjo pade.",
  "Cvetje v jeseni": "Življenje je kot reka, ki se nenehno spreminja.",
  "Alamut": "Nič ni resnično, vse je dovoljeno.",
  "Boštjan": "Pogum ni odsotnost strahu, temveč zmaga nad njim.",
  "Deseti brat": "Pravičnost je temelj vsake močne države.",
  "Visoška kronika": "Zgodovina se ponavlja, najprej kot tragedija, nato kot farsa."
};

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
      description: `Dosegel si ${scoreResult.points} točk in ${scoreResult.rank} rang!`,
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
      
      // Dodamo citat, če ga imamo
      const quote = bookQuotes[element.title] || "Vsaka knjiga je vrata v novi svet.";
      
      const realBook: BookCover = {
        title: element.title,
        author: element.author,
        coverUrl: element.image_url,
        quote: quote,
        cobissUrl: `https://www.cobiss.net/si/sl/bib/search?q=${encodeURIComponent(element.title)}`
      };

      setCurrentBook(realBook);
      setGameStarted(false);
      setGameCompleted(false);
      setLoading(false);
    } catch (error) {
      console.error('Napaka pri nalaganju knjige:', error);
      setLoading(false);
      toast({
        title: "Napaka",
        description: "Napaka pri nalaganju knjige. Poskusite znova.",
        variant: "destructive"
      });
    }
  };

  const playAgain = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="h-16 w-16 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Nalagam knjigo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
        {!gameStarted ? (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm w-full max-w-5xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                📚 COBISS Puzzle
              </CardTitle>
              <p className="text-gray-600 mt-2">Sestavi puzzle in spoznaj slovensko literaturo</p>
            </CardHeader>
            <CardContent>
              {currentBook ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img
                        src={currentBook.coverUrl} 
                        alt={currentBook.title} 
                        className="h-80 sm:h-96 object-contain rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="min-h-[120px] mb-6">
                        <h3 className="text-2xl font-bold mb-3 text-gray-800 line-clamp-2" title={currentBook.title}>
                          {currentBook.title}
                        </h3>
                        <p className="text-lg text-gray-600 mb-2" title={`Avtor: ${currentBook.author}`}>
                          <span className="font-medium">Avtor:</span> {currentBook.author}
                        </p>
                        {currentBook.quote && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                            <p className="text-sm text-blue-700 italic">"{currentBook.quote}"</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <DifficultySelector 
                          difficulties={DIFFICULTIES}
                          selected={selectedDifficulty}
                          onChange={handleDifficultyChange}
                          className="w-full"
                        />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button 
                            onClick={startGame} 
                            disabled={!currentBook}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-semibold"
                            size="lg"
                          >
                            🎮 Začni igro
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={loadRandomBook}
                            className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 py-3 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl font-semibold"
                            size="lg"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Nova knjiga
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-500 text-lg">Napaka pri nalaganju knjige</p>
                  <Button onClick={loadRandomBook} className="mt-4">
                    Poskusi znova
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap justify-center gap-4 pt-6">
              <StatisticsDialog />
              <InstructionsDialog />
              <SettingsDialog />
              {currentBook?.cobissUrl && (
                <Button 
                  variant="secondary"
                  onClick={() => window.open(currentBook.cobissUrl, '_blank')}
                  size={isMobile ? "lg" : "default"}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-xl"
                >
                  <BookOpen className="h-4 w-4" />
                  COBISS Plus
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : gameCompleted ? (
          <div className="w-full max-w-5xl">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-80 z-0"></div>
              <div className="relative z-10">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold">
                    🎉 Čestitke!
                  </CardTitle>
                  <p className="text-gray-700 text-lg">Uspešno ste rešili puzzle!</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="flex justify-center">
                      <div className="relative group">
                        <img 
                          src={currentBook?.coverUrl} 
                          alt={currentBook?.title || "Knjiga"} 
                          className="h-64 sm:h-80 object-contain rounded-xl shadow-lg animate-[bounce_1s_ease-in-out] group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    </div>
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
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-semibold"
                    size="lg"
                  >
                    🎮 Igraj ponovno
                  </Button>
                  <Button 
                    onClick={loadRandomBook}
                    variant="outline"
                    className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 py-3 px-6 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl font-semibold"
                    size="lg"
                  >
                    📚 Nova knjiga
                  </Button>
                  <StatisticsDialog />
                  {currentBook?.cobissUrl && (
                    <Button 
                      variant="secondary"
                      onClick={() => window.open(currentBook.cobissUrl, '_blank')}
                      size="lg"
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-xl transition-all duration-200"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      COBISS Plus
                    </Button>
                  )}
                </CardFooter>
              </div>
            </Card>
          </div>
        ) : (
          <div className="w-full max-w-7xl space-y-6">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                  🧩 {selectedDifficulty.cols}×{selectedDifficulty.rows} Puzzle
                </CardTitle>
                <p className="text-center text-gray-600">
                  Kliknite na kos za obračanje • Povlecite za premikanje
                </p>
              </CardHeader>
              <CardContent className="pt-0 px-4 md:px-8 pb-6">
                {currentBook && (
                  <div className="flex justify-center w-full">
                    <div className="w-full max-w-[1400px]">
                      <PuzzleGame
                        imageSrc={currentBook.coverUrl}
                        rows={selectedDifficulty.rows}
                        cols={selectedDifficulty.cols}
                        onComplete={handleGameComplete}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center gap-4 pb-6">
                <Button 
                  variant="outline" 
                  onClick={playAgain}
                  className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 py-2 px-6 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl font-medium"
                  size={isMobile ? "lg" : "default"}
                >
                  ← Nazaj na izbiro
                </Button>
                <SettingsDialog />
                <InstructionsDialog />
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
