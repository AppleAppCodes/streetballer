import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Ball } from './Ball';
import { HoopBack, HoopFront } from './Hoop';
import { GameState, PhysicsState } from '../types';
import { BALL_RADIUS, BOUNCE_DAMPING, DRAG_POWER_SCALE, FLOOR_Y_OFFSET, FRICTION, GAME_DURATION, GRAVITY, HOOP_RADIUS, HOOP_Y, MAX_DRAG_DISTANCE } from '../constants';

interface GameProps {
  onGameOver: (score: number, shotsTaken: number) => void;
  gameState: GameState;
}

export const Game: React.FC<GameProps> = ({ onGameOver, gameState }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Game Logic State
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [netScale, setNetScale] = useState(1);

  // Physics Refs (Mutable for performance, preventing react re-renders on every frame)
  const physics = useRef<PhysicsState>({
    pos: { x: window.innerWidth / 2, y: window.innerHeight - FLOOR_Y_OFFSET },
    vel: { x: 0, y: 0 },
    isDragging: false,
    isAirborne: false,
    dragStart: null,
    dragCurrent: null,
  });

  const [renderTrigger, setRenderTrigger] = useState(0); // Force render for important updates
  const requestRef = useRef<number>();
  const scoreCooldown = useRef<boolean>(false);
  const [hoopX, setHoopX] = useState(window.innerWidth / 2);

  // Initialize Position
  useEffect(() => {
    const handleResize = () => {
      if (!physics.current.isAirborne && !physics.current.isDragging) {
        physics.current.pos = { x: window.innerWidth / 2, y: window.innerHeight - FLOOR_Y_OFFSET };
        setRenderTrigger(prev => prev + 1);
      }
      setHoopX(window.innerWidth / 2);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer
  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGameOver(score, shotsTaken);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, onGameOver, score, shotsTaken]);

  // Reset Ball
  const resetBall = useCallback(() => {
    physics.current.isAirborne = false;
    physics.current.vel = { x: 0, y: 0 };
    physics.current.pos = { x: window.innerWidth / 2, y: window.innerHeight - FLOOR_Y_OFFSET };
    physics.current.dragStart = null;
    physics.current.dragCurrent = null;
    scoreCooldown.current = false;
    setRenderTrigger(prev => prev + 1);
  }, []);

  // Game Loop
  const update = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    const p = physics.current;

    if (p.isAirborne) {
      // Apply Physics
      p.vel.y += GRAVITY;
      p.vel.x *= FRICTION; // Air resistance
      p.pos.x += p.vel.x;
      p.pos.y += p.vel.y;

      // Floor Collision
      const floorY = window.innerHeight - BALL_RADIUS;
      if (p.pos.y > floorY) {
        p.pos.y = floorY;
        p.vel.y *= -BOUNCE_DAMPING;

        // Stop if slow enough
        if (Math.abs(p.vel.y) < 2) {
          resetBall();
        }
      }

      // Wall Collision
      if (p.pos.x < BALL_RADIUS) {
        p.pos.x = BALL_RADIUS;
        p.vel.x *= -BOUNCE_DAMPING;
      } else if (p.pos.x > window.innerWidth - BALL_RADIUS) {
        p.pos.x = window.innerWidth - BALL_RADIUS;
        p.vel.x *= -BOUNCE_DAMPING;
      }

      // Hoop Collision (Refined)
      // Rim points are at x +/- HOOP_RADIUS
      const rimLeftX = hoopX - HOOP_RADIUS;
      const rimRightX = hoopX + HOOP_RADIUS;
      const rimY = HOOP_Y;

      // Simple distance check to rim edges for "bounce"
      const distLeft = Math.sqrt(Math.pow(p.pos.x - rimLeftX, 2) + Math.pow(p.pos.y - rimY, 2));
      const distRight = Math.sqrt(Math.pow(p.pos.x - rimRightX, 2) + Math.pow(p.pos.y - rimY, 2));

      const rimCollisionRadius = 5; // Tolerance

      // Bounce logic
      if (distLeft < BALL_RADIUS + rimCollisionRadius) {
        p.vel.x = Math.abs(p.vel.x) * 0.8; // Bounce right
        p.vel.y *= -0.8;
      } else if (distRight < BALL_RADIUS + rimCollisionRadius) {
        p.vel.x = -Math.abs(p.vel.x) * 0.8; // Bounce left
        p.vel.y *= -0.8;
      }

      // Scoring Logic
      const distToHoopCenter = Math.abs(p.pos.x - hoopX);
      if (
        !scoreCooldown.current &&
        distToHoopCenter < (HOOP_RADIUS - BALL_RADIUS + 10) && // Forgiving horizontal
        Math.abs(p.pos.y - HOOP_Y) < 20 && // Vertical sweet spot
        p.vel.y > 0 // Moving down
      ) {
        setScore(s => s + 1);
        scoreCooldown.current = true;
        // Trigger net animation
        setNetScale(1.15);
        setTimeout(() => setNetScale(1), 150);
      }
    }

    setRenderTrigger(prev => prev + 1); // Trigger render
    requestRef.current = requestAnimationFrame(update);
  }, [gameState, hoopX, resetBall]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);


  // Input Handlers
  const handleStart = (clientX: number, clientY: number) => {
    if (gameState !== GameState.PLAYING || physics.current.isAirborne) return;

    // Allow starting drag anywhere if not airborne, for easier mobile play
    physics.current.isDragging = true;
    physics.current.dragStart = { x: clientX, y: clientY };
    physics.current.dragCurrent = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!physics.current.isDragging) return;
    physics.current.dragCurrent = { x: clientX, y: clientY };
    setRenderTrigger(prev => prev + 1);
  };

  const handleEnd = () => {
    if (!physics.current.isDragging) return;

    const start = physics.current.dragStart!;
    const current = physics.current.dragCurrent!;

    // Calculate vector (Swipe direction)
    let dx = current.x - start.x;
    let dy = current.y - start.y;

    // Only allow throwing upwards
    if (dy > 0) {
      physics.current.isDragging = false;
      physics.current.dragStart = null;
      physics.current.dragCurrent = null;
      setRenderTrigger(prev => prev + 1);
      return;
    }

    // Cap power
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > MAX_DRAG_DISTANCE) {
      const scale = MAX_DRAG_DISTANCE / dist;
      dx *= scale;
      dy *= scale;
    }

    if (dist > 20) { // Minimum swipe distance
      physics.current.isDragging = false;
      physics.current.isAirborne = true;
      // Adjust power scale for swipe feel - increased slightly
      const SWIPE_POWER_SCALE = DRAG_POWER_SCALE * 1.5;
      physics.current.vel = {
        x: dx * SWIPE_POWER_SCALE,
        y: dy * SWIPE_POWER_SCALE
      };
      setShotsTaken(s => s + 1);
    } else {
      // Cancel shot
      physics.current.isDragging = false;
    }

    physics.current.dragStart = null;
    physics.current.dragCurrent = null;
    setRenderTrigger(prev => prev + 1);
  };

  // Trajectory Line Calculation
  const getTrajectoryPath = () => {
    // Re-added for visual flair, even if simple line is used
    if (!physics.current.isDragging || !physics.current.dragStart || !physics.current.dragCurrent) return "";
    /* ... kept simple if needed, or unused if we stick to the line below */
    return "";
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-transparent touch-none overflow-hidden"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* HUD Layer */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-40 pointer-events-none font-[family-name:var(--font-display)]">
        <div className="flex flex-col items-center">
          <div className="text-white/60 text-lg tracking-widest uppercase">Punkte</div>
          <div className="text-6xl font-bold text-orange-500 drop-shadow-[0_2px_10px_rgba(249,115,22,0.5)]">{score}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-white/60 text-lg tracking-widest uppercase">Zeit</div>
          <div className={`text-6xl font-bold drop-shadow-md ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Swipe Indicator */}
      {physics.current.isDragging && physics.current.dragStart && physics.current.dragCurrent && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="swipeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
            </linearGradient>
          </defs>
          <line
            x1={physics.current.dragStart.x}
            y1={physics.current.dragStart.y}
            x2={physics.current.dragCurrent.x}
            y2={physics.current.dragCurrent.y}
            stroke="url(#swipeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="10 10"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Layering: Backboard -> Ball -> Front Rim/Net */}
      <HoopBack x={hoopX} />

      <Ball
        x={physics.current.pos.x}
        y={physics.current.pos.y}
        rotation={physics.current.pos.x * 2}
        isDragging={physics.current.isDragging}
      />

      <HoopFront x={hoopX} netScale={netScale} />

      {/* Floor Visual */}
      <div className="absolute bottom-0 w-full h-32 z-0 pointer-events-none">
        {/* Concrete Texture */}
        <div className="absolute inset-0 bg-[#2d3436] opacity-90"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`
          }}>
        </div>
        {/* Reflection Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        {/* Environment Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-20 bg-orange-500/10 blur-[50px]"></div>
      </div>
    </div>
  );
}