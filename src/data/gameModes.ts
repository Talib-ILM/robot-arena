// ==========================================
// Game Mode Data & Maps
// ==========================================

import { GameMode } from '../types';

export interface GameModeInfo {
  id: GameMode;
  name: string;
  description: string;
  icon: string;
  maxPlayers: number;
  timeLimit: number;
}

export const GAME_MODES: GameModeInfo[] = [
  {
    id: 'gem-grab',
    name: 'Gem Grab',
    description: 'Collect 10 gems from the mine to win. Gems spawn in the center.',
    icon: '💎',
    maxPlayers: 6,
    timeLimit: 180,
  },
  {
    id: 'showdown',
    name: 'Showdown',
    description: 'Last robot standing wins. Power cubes spawn across the map.',
    icon: '⚔️',
    maxPlayers: 8,
    timeLimit: 120,
  },
  {
    id: 'heist',
    name: 'Heist',
    description: 'Destroy the enemy safe while defending your own.',
    icon: '🔒',
    maxPlayers: 4,
    timeLimit: 150,
  },
];

export interface MapConfig {
  size: number;
  gemSpawnPoints: { x: number; z: number }[];
  powerCubeSpawns: { x: number; z: number }[];
  obstaclePositions: { x: number; z: number; width: number; depth: number }[];
}

export const MAP_CONFIGS: Record<string, MapConfig> = {
  small: {
    size: 30,
    gemSpawnPoints: [
      { x: 0, z: 0 },
      { x: 3, z: 0 },
      { x: -3, z: 0 },
      { x: 0, z: 3 },
      { x: 0, z: -3 },
    ],
    powerCubeSpawns: [
      { x: -8, z: -8 },
      { x: 8, z: 8 },
      { x: -8, z: 8 },
      { x: 8, z: -8 },
      { x: 0, z: 10 },
      { x: 0, z: -10 },
    ],
    obstaclePositions: [
      { x: -6, z: 0, width: 2, depth: 8 },
      { x: 6, z: 0, width: 2, depth: 8 },
      { x: 0, z: -6, width: 8, depth: 2 },
      { x: 0, z: 6, width: 8, depth: 2 },
    ],
  },
  medium: {
    size: 50,
    gemSpawnPoints: [
      { x: 0, z: 0 },
      { x: 5, z: 0 },
      { x: -5, z: 0 },
      { x: 0, z: 5 },
      { x: 0, z: -5 },
      { x: 5, z: 5 },
      { x: -5, z: -5 },
    ],
    powerCubeSpawns: [
      { x: -12, z: -12 },
      { x: 12, z: 12 },
      { x: -12, z: 12 },
      { x: 12, z: -12 },
      { x: 0, z: 15 },
      { x: 0, z: -15 },
      { x: 15, z: 0 },
      { x: -15, z: 0 },
    ],
    obstaclePositions: [
      { x: -10, z: 0, width: 2, depth: 12 },
      { x: 10, z: 0, width: 2, depth: 12 },
      { x: 0, z: -10, width: 12, depth: 2 },
      { x: 0, z: 10, width: 12, depth: 2 },
      { x: -15, z: -15, width: 4, depth: 4 },
      { x: 15, z: 15, width: 4, depth: 4 },
    ],
  },
  large: {
    size: 70,
    gemSpawnPoints: [
      { x: 0, z: 0 },
      { x: 5, z: 0 },
      { x: -5, z: 0 },
      { x: 0, z: 5 },
      { x: 0, z: -5 },
      { x: 8, z: 8 },
      { x: -8, z: -8 },
      { x: 8, z: -8 },
      { x: -8, z: 8 },
    ],
    powerCubeSpawns: [
      { x: -20, z: -20 },
      { x: 20, z: 20 },
      { x: -20, z: 20 },
      { x: 20, z: -20 },
      { x: 0, z: 25 },
      { x: 0, z: -25 },
      { x: 25, z: 0 },
      { x: -25, z: 0 },
      { x: -15, z: 0 },
      { x: 15, z: 0 },
    ],
    obstaclePositions: [
      { x: -15, z: 0, width: 2, depth: 16 },
      { x: 15, z: 0, width: 2, depth: 16 },
      { x: 0, z: -15, width: 16, depth: 2 },
      { x: 0, z: 15, width: 16, depth: 2 },
      { x: -22, z: -22, width: 5, depth: 5 },
      { x: 22, z: 22, width: 5, depth: 5 },
      { x: -22, z: 22, width: 5, depth: 5 },
      { x: 22, z: -22, width: 5, depth: 5 },
    ],
  },
};
