import React from 'react';
import { HOOP_RADIUS, HOOP_Y } from '../constants';

interface HoopProps {
  x: number;
  netScale?: number;
}

export const HoopBack: React.FC<HoopProps> = ({ x }) => {
  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        left: x - HOOP_RADIUS,
        top: HOOP_Y,
        width: HOOP_RADIUS * 2,
        height: 10,
      }}
    >
      {/* Backboard */}
      <div 
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-20 bg-white/90 border-4 border-gray-400 rounded-md shadow-md flex items-center justify-center"
      >
        <div className="w-16 h-12 border-2 border-orange-600"></div>
      </div>
      
       {/* Connector */}
       <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-800 rounded-sm -z-10"></div>
    </div>
  );
};

export const HoopFront: React.FC<HoopProps> = ({ x, netScale = 1 }) => {
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        left: x - HOOP_RADIUS,
        top: HOOP_Y,
        width: HOOP_RADIUS * 2,
        height: 10,
      }}
    >
      {/* Rim (Front Half) */}
      <div 
        className="absolute top-0 left-0 w-full h-2 bg-orange-600 rounded-full shadow-sm"
      ></div>

      {/* Net */}
      <div 
        className="absolute top-1 left-1 w-[90%] h-16 border-l-2 border-r-2 border-b-2 border-white/50 origin-top transition-transform duration-200 ease-out"
        style={{
             transform: `scale(${netScale})`,
             clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
             backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.7) 5px, rgba(255,255,255,0.7) 6px), repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.7) 5px, rgba(255,255,255,0.7) 6px)'
        }}
      ></div>
    </div>
  );
};