// ==========================================
// Robot Data - 4 unlockable characters
// ==========================================

import { Robot, RobotId } from '../types';

export const ROBOTS: Record<RobotId, Robot> = {
  bolt: {
    id: 'bolt',
    name: 'Bolt',
    description: 'Fast and agile scout robot. Excels at hit-and-run tactics with rapid-fire energy bolts.',
    color: '#3b82f6',
    accentColor: '#60a5fa',
    unlocked: true,
    stats: {
      health: 800,
      maxHealth: 800,
      speed: 8,
      damage: 80,
      attackRange: 12,
      attackSpeed: 0.3,
      specialCooldown: 8,
      specialDamage: 200,
      armor: 0,
    },
    specialName: 'Lightning Dash',
  },
  tank: {
    id: 'tank',
    name: 'Tank',
    description: 'Heavy assault robot with massive armor. Slow but devastating in close combat.',
    color: '#22c55e',
    accentColor: '#4ade80',
    unlocked: false,
    stats: {
      health: 1500,
      maxHealth: 1500,
      speed: 4,
      damage: 150,
      attackRange: 6,
      attackSpeed: 0.8,
      specialCooldown: 12,
      specialDamage: 350,
      armor: 5,
    },
    specialName: 'Shield Slam',
  },
  spark: {
    id: 'spark',
    name: 'Spark',
    description: 'Tech specialist with area-of-effect electric attacks. Great at controlling zones.',
    color: '#eab308',
    accentColor: '#facc15',
    unlocked: false,
    stats: {
      health: 900,
      maxHealth: 900,
      speed: 6,
      damage: 60,
      attackRange: 10,
      attackSpeed: 0.4,
      specialCooldown: 10,
      specialDamage: 150,
      armor: 1,
    },
    specialName: 'Tesla Storm',
  },
  hex: {
    id: 'hex',
    name: 'Hex',
    description: 'Mysterious drone robot with homing projectiles and stealth capabilities.',
    color: '#a855f7',
    accentColor: '#c084fc',
    unlocked: false,
    stats: {
      health: 700,
      maxHealth: 700,
      speed: 7,
      damage: 100,
      attackRange: 14,
      attackSpeed: 0.5,
      specialCooldown: 10,
      specialDamage: 180,
      armor: 0,
    },
    specialName: 'Void Warp',
  },
};

export const UNLOCK_COSTS: Record<number, number> = {
  1: 500,
  2: 1000,
  3: 2000,
};
