import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const SPEED = 100; // Faster, more jarring

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    directionRef.current = { x: 0, y: -1 };
    setFood(generateFood([{ x: 10, y: 10 }]));
    setIsGameOver(false);
    setIsPlaying(true);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true); setIsPlaying(false); return prevSnake;
        }
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true); setIsPlaying(false); return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const gameLoop = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameLoop);
  }, [isPlaying, isGameOver, food, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / GRID_SIZE;
    const cellH = height / GRID_SIZE;

    // Glitchy background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Jarring grid
    ctx.strokeStyle = Math.random() > 0.9 ? '#f0f' : '#0ff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellH); ctx.lineTo(width, i * cellH); ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // Screen tear effect randomly
    if (Math.random() > 0.95) {
      ctx.fillStyle = '#f0f';
      ctx.fillRect(0, Math.random() * height, width, 2);
    }

    // Draw food (Magenta block)
    ctx.fillStyle = '#f0f';
    ctx.fillRect(food.x * cellW + 2, food.y * cellH + 2, cellW - 4, cellH - 4);
    
    // Draw snake (Cyan blocks)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#fff' : '#0ff';
      ctx.fillRect(segment.x * cellW + 1, segment.y * cellH + 1, cellW - 2, cellH - 2);
      
      // Glitch offset occasionally
      if (Math.random() > 0.9) {
        ctx.fillStyle = '#f0f';
        ctx.fillRect(segment.x * cellW + 4, segment.y * cellH + 1, cellW - 2, cellH - 2);
      }
    });

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="relative border-4 border-[#0ff] w-full max-w-[400px] aspect-square bg-black shadow-[8px_8px_0_#f0f]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 p-4 text-center">
            {isGameOver ? (
              <>
                <h3 className="text-2xl md:text-3xl font-pixel text-[#f0f] mb-4 glitch-text" data-text="ENTITY.TERMINATED">ENTITY.TERMINATED</h3>
                <p className="text-[#0ff] font-vt text-2xl mb-8">FINAL_DUMP: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-transparent border-2 border-[#0ff] text-[#0ff] font-pixel text-sm hover:bg-[#0ff] hover:text-black transition-colors uppercase shadow-[4px_4px_0_#f0f] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  EXECUTE.RESTART()
                </button>
              </>
            ) : (
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-transparent border-2 border-[#0ff] text-[#0ff] font-pixel text-sm hover:bg-[#0ff] hover:text-black transition-colors uppercase shadow-[4px_4px_0_#f0f] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
              >
                INIT.SEQUENCE()
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mt-8 text-xl text-[#f0f] font-vt uppercase tracking-widest">
        INPUT: [W][A][S][D] // ARROWS
      </div>
    </div>
  );
}
