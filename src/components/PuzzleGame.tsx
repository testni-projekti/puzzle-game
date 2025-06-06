
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/Timer';
import { getScoringConfig, calculateScore, ScoreResult } from '@/utils/scoringSystem';
import { GameStorage } from '@/utils/gameStorage';
import { Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  rotation: number;
  isCorrect: boolean;
}

interface PuzzleGameProps {
  imageSrc: string;
  rows: number;
  cols: number;
  onComplete: (scoreResult: ScoreResult, completionTime: number) => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ 
  imageSrc, 
  rows, 
  cols, 
  onComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [pieceSize, setPieceSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [correctPieces, setCorrectPieces] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();
  const [showSolution, setShowSolution] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameTimer, setGameTimer] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [pointsLostToHints, setPointsLostToHints] = useState(0);
  const scoringConfig = getScoringConfig(rows, cols);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const now = audioCtx.currentTime;
  
      const bufferSize = audioCtx.sampleRate * 0.04;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
  
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3.0);
      }
  
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
  
      const snapFilter = audioCtx.createBiquadFilter();
      snapFilter.type = "bandpass";
      snapFilter.frequency.setValueAtTime(800, now);
      snapFilter.Q.setValueAtTime(7, now);
  
      const snapGain = audioCtx.createGain();
      snapGain.gain.setValueAtTime(0.8, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  
      noise.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(audioCtx.destination);
  
      const thumpOsc = audioCtx.createOscillator();
      const thumpGain = audioCtx.createGain();
      thumpOsc.type = "sine";
      thumpOsc.frequency.setValueAtTime(120, now);
      thumpGain.gain.setValueAtTime(0.5, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  
      thumpOsc.connect(thumpGain);
      thumpGain.connect(audioCtx.destination);
  
      noise.start(now);
      thumpOsc.start(now);
      thumpOsc.stop(now + 0.3);
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  };

  useEffect(() => {
    if (pieces.length > 0 && !gameStartTime) {
      setGameStartTime(Date.now());
      setGameTimer(true);
    }
  }, [pieces, gameStartTime]);

  useEffect(() => {
    const currentlyCorrect = new Set(
      pieces.filter(p => p.isCorrect).map(p => p.id)
    );
    
    if (currentlyCorrect.size > correctPieces.size) {
      playSuccessSound();
    }
    
    setCorrectPieces(currentlyCorrect);
    
    if (pieces.length > 0 && pieces.every(piece => piece.isCorrect) && !isComplete) {
      setIsComplete(true);
      setGameTimer(false);
      
      const scoreResult = calculateScore(currentTime, rows, cols);
      GameStorage.saveResult(rows, cols, currentTime, scoreResult.points, scoreResult.maxPoints, scoreResult.rank, hintsUsed, pointsLostToHints);
      onComplete(scoreResult, currentTime);
    }
  }, [pieces, currentTime, rows, cols, isComplete, correctPieces.size, onComplete, hintsUsed, pointsLostToHints]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageAspectRatio(img.width / img.height);
      setImageLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!imageAspectRatio) return;
    
    const updateSize = () => {
      if (!containerRef.current) return;
      
      const maxWidth = Math.min(window.innerWidth * 0.9, 1200);
      const maxHeight = window.innerHeight * 0.7;
      
      let width = maxWidth;
      let height = width / imageAspectRatio;
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * imageAspectRatio;
      }
      
      setContainerDimensions({ width, height });
      setContainerSize({ width, height });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [imageAspectRatio]);

  useEffect(() => {
    if (containerSize.width > 0 && imageLoaded) {
      initGame();
    }
  }, [containerSize, imageLoaded, rows, cols]);

  const initGame = () => {
    if (!containerRef.current || containerSize.width === 0) return;
    
    const pieceWidth = containerSize.width / cols;
    const pieceHeight = pieceWidth * (1 / imageAspectRatio! * (cols / rows));
    setPieceSize({ width: pieceWidth, height: pieceHeight });
    
    const newPieces: PuzzlePiece[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = row * cols + col;
        const correctX = col * pieceWidth;
        const correctY = row * pieceHeight;
        
        newPieces.push({
          id,
          x: Math.random() * (containerSize.width - pieceWidth),
          y: Math.random() * (containerSize.height - pieceHeight),
          correctX,
          correctY,
          rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
          isCorrect: false
        });
      }
    }
    
    setPieces(newPieces);
    setIsComplete(false);
    setHintsUsed(0);
    setPointsLostToHints(0);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();   

    const piece = pieces.find(p => p.id === id);
    if (!piece) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    
    if ('clientX' in e) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    else if ('touches' in e) {
      setDragOffset({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      });
    }
    
    setDraggingPiece(id);
    setPieces(prev => [...prev.filter(p => p.id !== id), piece]);
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (draggingPiece === null) return;
    
    e.preventDefault();
    
    const containerRect = containerRef.current!.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } 
    else if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      return;
    }

    const x = clientX - containerRect.left - dragOffset.x;
    const y = clientY - containerRect.top - dragOffset.y;

    setPieces(prev => prev.map(piece => {
      if (piece.id === draggingPiece) {
        const boundedX = Math.min(Math.max(0, x), containerSize.width - pieceSize.width);
        const boundedY = Math.min(Math.max(0, y), containerSize.height - pieceSize.height);
        return { ...piece, x: boundedX, y: boundedY, isCorrect: false };
      }
      return piece;
    }));
  };

  const handleDragEnd = () => {
    if (draggingPiece !== null) {
      setPieces(prev => prev.map(piece => {
        if (piece.id === draggingPiece) {
          const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.15;
          const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.15;
          const isCorrectRotation = piece.rotation % 360 === 0;
          
          if (isCloseX && isCloseY && isCorrectRotation) {
            return {
              ...piece,
              x: piece.correctX,
              y: piece.correctY,
              isCorrect: true
            };
          }
          return { ...piece, isCorrect: false };
        }
        return piece;
      }));
      
      setDraggingPiece(null);
    }
  };

  // Popravljena rotacija - en klik
  const rotatePiece = (id: number) => {
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        const newRotation = (piece.rotation + 90) % 360;
        const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.15;
        const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.15;
        const isCorrectRotation = newRotation === 0;
        
        return {
          ...piece,
          rotation: newRotation,
          isCorrect: isCloseX && isCloseY && isCorrectRotation,
          x: isCloseX && isCloseY && isCorrectRotation ? piece.correctX : piece.x,
          y: isCloseX && isCloseY && isCorrectRotation ? piece.correctY : piece.y
        };
      }
      return piece;
    }));
  };

  // Preklopi prikaz resitve z zmanjsanjem tock
  const toggleSolution = () => {
    if (!showSolution) {
      const pointsLost = Math.floor(scoringConfig.maxPoints * 0.1);
      setPointsLostToHints(prev => prev + pointsLost);
      setHintsUsed(prev => prev + 1);
    }
    setShowSolution(!showSolution);
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {/* Stoparica in tockovanje */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
        <Timer
          isRunning={gameTimer}
          onTimeUpdate={handleTimeUpdate}
          timeLimit={scoringConfig.timeLimit}
          className="flex-1"
        />
        <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-green-700 font-semibold flex-1 shadow-sm">
          <div className="text-sm text-green-600 mb-1">Maksimalno</div>
          <div className="text-xl font-bold">{scoringConfig.maxPoints - pointsLostToHints}</div>
          <div className="text-xs text-green-500">točk</div>
        </div>
      </div>

      {/* Kontrolni gumbi */}
      <div className="flex gap-3 flex-wrap justify-center">
        <Button 
          variant="outline" 
          onClick={toggleSolution}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-blue-200 text-blue-700 hover:border-blue-300 transition-all duration-200 rounded-xl shadow-sm"
          size="sm"
        >
          {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showSolution ? 'Skrij rešitev' : 'Prikaži rešitev (-10%)'}
        </Button>

        {hintsUsed > 0 && (
          <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Pomoči: {hintsUsed} (-{pointsLostToHints} točk)
          </div>
        )}
      </div>
      
      <div className="relative" style={{
        width: `${containerDimensions.width}px`,
        height: `${containerDimensions.height}px`,
        maxWidth: '90vw',
        maxHeight: '70vh'
      }}>
        {showSolution && (
          <div 
            className="absolute inset-0 z-0 rounded-xl"
            style={{
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '100%',
              height: '100%',
            }}
          />
        )}
        
        <div 
          ref={containerRef}
          className={cn(
            "relative w-full h-full rounded-xl shadow-inner overflow-hidden touch-none border-2",
            showSolution ? 'bg-white/40 border-blue-200' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200',
            !imageLoaded && 'invisible'
          )}
          onMouseMove={(e) => handleDragMove(e)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={(e) => handleDragMove(e)}
          onTouchEnd={handleDragEnd}
        >
          <div 
            className="absolute inset-0 grid pointer-events-none" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
          >
            {Array.from({ length: rows * cols }).map((_, i) => (
              <div key={`grid-${i}`} className="border border-dashed border-gray-300/50" />
            ))}
          </div>
          
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={cn(
                "absolute cursor-grab active:cursor-grabbing group",
                "transition-all duration-200 hover:scale-105"
              )}
              style={{
                width: `${pieceSize.width}px`,
                height: `${pieceSize.height}px`,
                left: `${piece.x}px`,
                top: `${piece.y}px`,
                zIndex: draggingPiece === piece.id ? 10 : 1,
                transform: `rotate(${piece.rotation}deg)`,
                touchAction: "none"
              }}
              onMouseDown={(e) => handleDragStart(e, piece.id)}
              onTouchStart={(e) => handleDragStart(e, piece.id)}
              onClick={() => rotatePiece(piece.id)}
            >
              <div 
                className={cn(
                  "w-full h-full rounded-lg border-2 overflow-hidden",
                  piece.isCorrect ? "border-green-400 shadow-green-200 shadow-lg" : "border-gray-300 shadow-lg",
                  "transition-all duration-200 group-hover:shadow-xl"
                )}
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: `${cols * 100}% ${rows * 100}%`,
                  backgroundPosition: `${-piece.correctX / pieceSize.width * 100}% ${-piece.correctY / pieceSize.height * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
