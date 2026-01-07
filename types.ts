export interface Vector2 {
  x: number;
  y: number;
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface GameStats {
  score: number;
  shotsTaken: number;
  shotsMade: number;
  timeLeft: number;
}

export interface PhysicsState {
  pos: Vector2;
  vel: Vector2;
  isDragging: boolean;
  isAirborne: boolean;
  dragStart: Vector2 | null;
  dragCurrent: Vector2 | null;
}