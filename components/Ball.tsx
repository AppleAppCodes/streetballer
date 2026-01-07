import React from 'react';
import { BALL_RADIUS } from '../constants';

interface BallProps {
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
}

export const Ball: React.FC<BallProps> = ({ x, y, rotation, isDragging }) => {
  return (
    <div
      className="absolute z-20 flex items-center justify-center rounded-full shadow-2xl pointer-events-none overflow-hidden"
      style={{
        width: BALL_RADIUS * 2,
        height: BALL_RADIUS * 2,
        left: x - BALL_RADIUS,
        top: y - BALL_RADIUS,
        transform: `rotate(${rotation}deg) scale(${isDragging ? 0.98 : 1})`,
        background: 'radial-gradient(circle at 35% 35%, #ff9f43 0%, #e67e22 50%, #d35400 85%, #a04000 100%)',
        boxShadow: `
          inset -10px -10px 20px rgba(0,0,0,0.4),
          inset 10px 10px 20px rgba(255,255,255,0.2),
          0 10px 20px rgba(0,0,0,0.3)
        `,
        transition: isDragging ? 'transform 0.05s ease-out' : 'none',
      }}
    >
      {/* Pebbled Texture Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(#000 10%, transparent 10%)`,
          backgroundSize: '4px 4px',
        }}
      />

      {/* Specular Highlight */}
      <div
        className="absolute w-[40%] h-[20%] rounded-[100%] bg-white/20 blur-[2px] top-[15%] left-[15%] -rotate-[45deg]"
      />

      {/* Basketball Ribs (Lines) */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ stroke: '#2d3436', strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' }}
      >
        {/* Horizontal & Vertical Cross */}
        <line x1="0" y1="50" x2="100" y2="50" />
        <line x1="50" y1="0" x2="50" y2="100" />

        {/* Curved Ribs */}
        <path d="M 15 15 Q 50 50 85 85" opacity="0.8" />
        <path d="M 85 15 Q 50 50 15 85" opacity="0.8" />
      </svg>
    </div>
  );
};