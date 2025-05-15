
import React, { useEffect, useState, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface PuzzleGameProps {
  imageSrc: string;
  rows: number;
  cols: number;
  onComplete: () => void;
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

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ 
  imageSrc, 
  rows, 
  cols, 
  onComplete 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [pieceSize, setPieceSize] = useState({ width: 0, height: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const isMobile = useIsMobile();

  // Load the image and set up the game
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      initGame();
    };
    img.src = imageSrc;
    
    // Set up container size
    const updateContainerSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };
    
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [imageSrc]);
  
  // Calculate piece size when container size is available
  useEffect(() => {
    if (containerSize.width > 0 && imageLoaded) {
      initGame();
    }
  }, [containerSize, imageLoaded, rows, cols]);

  const initGame = () => {
    if (!containerRef.current || containerSize.width === 0) return;
    
    // Calculate the size of each puzzle piece
    const pieceWidth = containerSize.width / cols;
    const pieceHeight = (pieceWidth * 1.4); // Maintain aspect ratio close to book covers
    
    setPieceSize({ width: pieceWidth, height: pieceHeight });
    
    // Create puzzle pieces
    const newPieces: PuzzlePiece[] = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = row * cols + col;
        
        // Calculate correct position
        const correctX = col * pieceWidth;
        const correctY = row * pieceHeight;
        
        // Randomize starting position within the container
        const randomX = Math.random() * (containerSize.width - pieceWidth);
        const randomY = Math.random() * (containerSize.width - pieceHeight);
        
        // Random rotation (0, 90, 180, or 270 degrees)
        const rotations = [0, 90, 180, 270];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        
        newPieces.push({
          id,
          x: randomX,
          y: randomY,
          correctX,
          correctY,
          rotation: randomRotation,
          isCorrect: false
        });
      }
    }
    
    setPieces(newPieces);
    setIsComplete(false);
  };

  // Check if all pieces are in their correct positions
  useEffect(() => {
    if (pieces.length === 0) return;
    
    const allCorrect = pieces.every(piece => piece.isCorrect);
    
    if (allCorrect && !isComplete) {
      setIsComplete(true);
      onComplete();
    }
  }, [pieces, isComplete, onComplete]);

  // Handle piece movement
  const handlePieceMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const piece = pieces.find(p => p.id === id);
    
    if (piece) {
      // Calculate the offset from the mouse click point to the piece's top-left corner
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      setDragOffset({ x: offsetX, y: offsetY });
      setDraggingPiece(id);
      
      // Bring the piece to the front by moving it to the end of the array
      setPieces(prev => [
        ...prev.filter(p => p.id !== id),
        piece
      ]);
    }
  };

  const handlePieceTouchStart = (e: React.TouchEvent, id: number) => {
    e.preventDefault();
    const piece = pieces.find(p => p.id === id);
    
    if (piece) {
      const touch = e.touches[0];
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const offsetX = touch.clientX - rect.left;
      const offsetY = touch.clientY - rect.top;
      
      setDragOffset({ x: offsetX, y: offsetY });
      setDraggingPiece(id);
      
      // Bring the piece to the front
      setPieces(prev => [
        ...prev.filter(p => p.id !== id),
        piece
      ]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingPiece !== null) {
      const containerRect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - containerRect.left - dragOffset.x;
      const y = e.clientY - containerRect.top - dragOffset.y;
      
      movePiece(draggingPiece, x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingPiece !== null) {
      const touch = e.touches[0];
      const containerRect = containerRef.current!.getBoundingClientRect();
      const x = touch.clientX - containerRect.left - dragOffset.x;
      const y = touch.clientY - containerRect.top - dragOffset.y;
      
      movePiece(draggingPiece, x, y);
    }
  };

  const handleMouseUp = () => {
    if (draggingPiece !== null) {
      checkPosition(draggingPiece);
      setDraggingPiece(null);
    }
  };

  const movePiece = (id: number, x: number, y: number) => {
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        return { ...piece, x, y };
      }
      return piece;
    }));
  };

  const checkPosition = (id: number) => {
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        // Check if the piece is close to its correct position
        const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.3;
        const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.3;
        const isCorrectRotation = piece.rotation % 360 === 0; // Only correct if not rotated
        
        // If close, snap to the correct position
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
  };

  const rotatePiece = (id: number) => {
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        const newRotation = (piece.rotation + 90) % 360;
        return { ...piece, rotation: newRotation, isCorrect: false };
      }
      return piece;
    }));
  };

  const handleDoubleClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    rotatePiece(id);
  };

  const handleDoubleTap = (id: number) => {
    rotatePiece(id);
  };
  
  // Debounced double tap detection
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapIdRef = useRef<number | null>(null);
  
  const handleTap = (id: number) => {
    if (lastTapIdRef.current === id && tapTimerRef.current) {
      // Double tap detected
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
      lastTapIdRef.current = null;
      handleDoubleTap(id);
    } else {
      // First tap
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
      
      lastTapIdRef.current = id;
      tapTimerRef.current = setTimeout(() => {
        tapTimerRef.current = null;
        lastTapIdRef.current = null;
      }, 300); // 300ms window for double tap
    }
  };

  return (
    <div className="flex justify-center">
      <div 
        ref={containerRef}
        className="relative w-full aspect-[3/4] max-w-lg bg-gray-100 rounded-md shadow-inner overflow-hidden touch-none"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Background grid to visualize puzzle positions */}
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div key={`grid-${i}`} className="border border-dashed border-gray-300" />
          ))}
        </div>
        
        {/* Puzzle pieces */}
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className={cn(
              "absolute cursor-grab active:cursor-grabbing",
              piece.isCorrect && "transition-all duration-300"
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
            onMouseDown={(e) => handlePieceMouseDown(e, piece.id)}
            onTouchStart={(e) => handlePieceTouchStart(e, piece.id)}
            onDoubleClick={(e) => handleDoubleClick(e, piece.id)}
            onTouchEnd={() => isMobile && handleTap(piece.id)}
          >
            <div 
              className={cn(
                "w-full h-full bg-white border-2 overflow-hidden",
                piece.isCorrect ? "border-green-500" : "border-gray-400"
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
  );
};
