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
      className="absolute z-20 flex items-center justify-center rounded-full shadow-lg pointer-events-none"
      style={{
        width: BALL_RADIUS * 2,
        height: BALL_RADIUS * 2,
        left: x - BALL_RADIUS,
        top: y - BALL_RADIUS,
        transform: `rotate(${rotation}deg) scale(${isDragging ? 0.95 : 1})`,
        background: 'radial-gradient(circle at 30% 30%, #ff9f43, #d35400)',
        border: '2px solid #2d3436',
        transition: isDragging ? 'transform 0.1s' : 'none',
      }}
    >
      {/* Basketball Lines */}
      <div className="absolute w-full h-[2px] bg-neutral-800/80 top-1/2 -translate-y-1/2"></div>
      <div className="absolute h-full w-[2px] bg-neutral-800/80 left-1/2 -translate-x-1/2"></div>
      <div className="absolute w-[80%] h-[80%] border-2 border-neutral-800/80 rounded-full opacity-60"></div>
    </div>
  );
};