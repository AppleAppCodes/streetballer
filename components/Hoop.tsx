import React from 'react';
import { HOOP_RADIUS, HOOP_Y } from '../constants';

interface HoopProps {
  x: number;
  netScale?: number;
}

const RIM_THICKNESS = 6;
const BOARD_WIDTH = 140;
const BOARD_HEIGHT = 90;

export const HoopBack: React.FC<HoopProps> = ({ x }) => {
  return (
    <div className="absolute z-10 pointer-events-none" style={{ left: x, top: HOOP_Y }}>
      {/* Pole (Support) */}
      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-4 h-[300px] bg-gradient-to-r from-neutral-800 to-neutral-600 -z-20"></div>

      {/* Backboard */}
      <div
        className="absolute -translate-x-1/2 left-0 -top-[100px] border-4 border-neutral-400 bg-white/10 backdrop-blur-sm shadow-xl"
        style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT, borderRadius: 8 }}
      >
        {/* Inner Box Target */}
        <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[50px] h-[40px] border-4 border-orange-600/80"></div>
        {/* Weathering/Grunge */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 opacity-50"></div>
      </div>

      {/* Back Rim (Darker for depth) */}
      <div
        className="absolute -translate-x-1/2 left-0 top-0 w-[calc(100%+8px)] h-4 bg-orange-800 rounded-full"
        style={{ width: HOOP_RADIUS * 2 + RIM_THICKNESS }}
      ></div>
    </div>
  );
};

export const HoopFront: React.FC<HoopProps> = ({ x, netScale = 1 }) => {
  return (
    <div className="absolute z-30 pointer-events-none" style={{ left: x, top: HOOP_Y }}>
      {/* Front Rim */}
      <div
        className="absolute -translate-x-1/2 left-0 top-0 h-4 border-[6px] border-orange-600 rounded-full border-t-transparent shadow-sm"
        style={{
          width: HOOP_RADIUS * 2 + RIM_THICKNESS,
          zIndex: 30
        }}
      ></div>

      {/* Chain Net */}
      <div
        className="absolute -translate-x-1/2 left-0 top-[10px]"
        style={{
          width: HOOP_RADIUS * 2 - 10,
          height: HOOP_RADIUS * 2.5,
          transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: `translateX(-50%) scaleY(${netScale})`,
          transformOrigin: 'top center'
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 120" preserveAspectRatio="none">
          <defs>
            <pattern id="chainPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M10,0 L0,10 L10,20 L20,10 Z" fill="none" stroke="#ccc" strokeWidth="1.5" />
            </pattern>
          </defs>
          {/* Net Shape */}
          <path
            d="M0,0 Q10,120 50,120 Q90,120 100,0"
            fill="url(#chainPattern)"
            stroke="none"
            opacity="0.8"
          />
          {/* Stronger Vertical Strands */}
          <path d="M10,0 L45,120 M90,0 L55,120 M30,0 L48,120 M70,0 L52,120" stroke="#aaa" strokeWidth="1" strokeOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
};