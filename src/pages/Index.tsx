
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PuzzleGame } from '@/components/PuzzleGame';
import { DifficultySelector } from '@/components/DifficultySelector';
import { BookInfo } from '@/components/BookInfo';
import { Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookCover } from '@/types/book';
import { fetchRandomBookCover } from '@/lib/api';

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

const Index = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DIFFICULTIES[0]);
  const [currentBook, setCurrentBook] = useState<BookCover | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadRandomBook();
  }, []);

  const loadRandomBook = async () => {
    setLoading(true);
    try {
      const book = await fetchRandomBookCover();
      setCurrentBook(book);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load book cover", error);
      toast({
        title: "Napaka pri nalaganju",
        description: "Trenutno ne moremo naložiti naslovnice knjige. Poskusite znova.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleGameComplete = () => {
    setGameCompleted(true);
    
    // Play sound effect
    const audio = new Audio('/success.mp3');
    audio.play().catch(e => console.error("Audio playback failed", e));
    
    toast({
      title: "Čestitamo! 🎉",
      description: "Uspešno ste sestavili sliko knjige!",
    });
  };

  const playAgain = () => {
    setGameStarted(false);
    setGameCompleted(false);
  };

  const loadNewBook = () => {
    loadRandomBook();
    setGameStarted(false);
    setGameCompleted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <header className="text-center mb-6 mt-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          Knjižni Puzzle
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Sestavi naslovnice knjig iz COBISS Plus kataloga in odkrij nove zanimive knjige!
        </p>
      </header>

      <div className="container mx-auto max-w-4xl">
        {!gameStarted ? (
          <Card className="shadow-lg border-2 border-primary/20 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Izberi težavnost</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-pulse text-lg">Nalaganje naslovnice...</div>
                </div>
              ) : currentBook ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    <img 
                      src={currentBook.coverUrl} 
                      alt={currentBook.title} 
                      className="h-64 sm:h-72 object-contain rounded-md shadow-md hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{currentBook.title}</h3>
                    <p className="text-gray-600 mb-4">Avtor: {currentBook.author}</p>
                    <DifficultySelector 
                      difficulties={DIFFICULTIES}
                      selected={selectedDifficulty}
                      onChange={handleDifficultyChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-500">Napaka pri nalaganju knjige</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button 
                onClick={startGame} 
                disabled={loading || !currentBook}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                size={isMobile ? "lg" : "default"}
              >
                Začni igro
              </Button>
              <Button 
                variant="outline" 
                onClick={loadNewBook}
                disabled={loading}
                size={isMobile ? "lg" : "default"}
              >
                Nova knjiga
              </Button>
            </CardFooter>
          </Card>
        ) : gameCompleted ? (
          <div className="space-y-6">
            <Card className="shadow-lg border-2 border-green-300 bg-white/90 backdrop-blur overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-60 z-0"></div>
              <div className="relative z-10">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-100 p-3">
                      <Trophy className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-2xl text-green-800">Čestitamo!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex justify-center">
                      <div className="relative group">
                        <img 
                          src={currentBook?.coverUrl} 
                          alt={currentBook?.title || "Knjiga"} 
                          className="h-64 sm:h-72 object-contain rounded-md shadow-lg animate-[bounce_1s_ease-in-out]" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></div>
                      </div>
                    </div>
                    <BookInfo book={currentBook} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-center gap-4">
                  <Button 
                    onClick={playAgain}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    size={isMobile ? "lg" : "default"}
                  >
                    Igraj ponovno
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={loadNewBook}
                    size={isMobile ? "lg" : "default"}
                  >
                    Nova knjiga
                  </Button>
                  {currentBook?.cobissUrl && (
                    <Button 
                      variant="secondary"
                      onClick={() => window.open(currentBook.cobissUrl, '_blank')}
                      size={isMobile ? "lg" : "default"}
                    >
                      Odpri v COBISS Plus
                    </Button>
                  )}
                </CardFooter>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="shadow-lg border border-primary/20 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-xl">
                  {selectedDifficulty.rows}×{selectedDifficulty.cols} Puzzle
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {currentBook && (
                  <PuzzleGame
                    imageSrc={currentBook.coverUrl}
                    rows={selectedDifficulty.rows}
                    cols={selectedDifficulty.cols}
                    onComplete={handleGameComplete}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={playAgain}
                  size={isMobile ? "lg" : "default"}
                >
                  Nazaj na izbiro težavnosti
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
