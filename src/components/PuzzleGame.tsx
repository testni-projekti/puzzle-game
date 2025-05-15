
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
  const [isRotating, setIsRotating] = useState(false); // Added to prevent dragging during rotation
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
    const pieceHeight = containerSize.height / rows;
    
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
        const randomY = Math.random() * (containerSize.height - pieceHeight);
        
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
    if (isRotating) return; // Don't start drag if we're rotating
    
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
    if (isRotating) return; // Don't start drag if we're rotating
    
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
        // Ensure piece stays within bounds
        const boundedX = Math.min(Math.max(0, x), containerSize.width - pieceSize.width);
        const boundedY = Math.min(Math.max(0, y), containerSize.height - pieceSize.height);
        return { ...piece, x: boundedX, y: boundedY };
      }
      return piece;
    }));
  };

  const checkPosition = (id: number) => {
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        // Check if the piece is close to its correct position and has correct orientation
        const isCloseX = Math.abs(piece.x - piece.correctX) < pieceSize.width * 0.15;
        const isCloseY = Math.abs(piece.y - piece.correctY) < pieceSize.height * 0.15;
        const isCorrectRotation = piece.rotation % 360 === 0; // Only correct if not rotated
        
        // If close AND correctly oriented, snap to the correct position
        if (isCloseX && isCloseY && isCorrectRotation) {
          return {
            ...piece,
            x: piece.correctX,
            y: piece.correctY,
            rotation: 0,
            isCorrect: true
          };
        }
        
        return { ...piece, isCorrect: false };
      }
      return piece;
    }));
  };

  const rotatePiece = (id: number) => {
    setIsRotating(true);
    
    setPieces(prev => prev.map(piece => {
      if (piece.id === id) {
        // Only allow 0, 90, 180, 270 degree rotations
        const newRotation = (piece.rotation + 90) % 360;
        return { ...piece, rotation: newRotation, isCorrect: false };
      }
      return piece;
    }));
    
    // Prevent drag events during rotation animation
    setTimeout(() => {
      setIsRotating(false);
      // Check if rotation put piece in correct position
      checkPosition(id);
    }, 300); // Match the CSS transition duration
  };

  const handleDoubleClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    rotatePiece(id);
  };

  // Improved tap detection for mobile
  const lastTapRef = useRef<{ id: number, time: number } | null>(null);
  
  const handleTap = (e: React.TouchEvent, id: number) => {
    e.preventDefault(); // Prevent default to avoid unwanted behaviors
    
    const now = new Date().getTime();
    const doubleTapDelay = 300; // milliseconds
    
    if (lastTapRef.current && lastTapRef.current.id === id && 
        now - lastTapRef.current.time < doubleTapDelay) {
      // Double tap detected
      rotatePiece(id);
      lastTapRef.current = null; // Reset after double tap
    } else {
      // First tap
      lastTapRef.current = { id, time: now };
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
              piece.isCorrect ? "transition-all duration-300 ease-in-out" : "transition-transform duration-300"
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
            onTouchEnd={(e) => isMobile && handleTap(e, piece.id)}
          >
            <div 
              className={cn(
                "w-full h-full bg-white border-2 overflow-hidden",
                piece.isCorrect ? "border-green-500" : "border-gray-400",
                "transition-all duration-200"  // Smooth transition for border changes
              )}
              style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${-piece.correctX / pieceSize.width * 100}% ${-piece.correctY / pieceSize.height * 100}%`,
                boxShadow: piece.isCorrect ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
