// ==========================================
// Robot Arena - Type Definitions
// ==========================================

export type RobotId = 'bolt' | 'tank' | 'spark' | 'hex';
export type GameMode = 'gem-grab' | 'showdown' | 'heist';
export type GameState = 'menu' | 'robot-select' | 'match-lobby' | 'playing' | 'results';
export type RobotState = 'idle' | 'moving' | 'attacking' | 'special' | 'damaged' | 'dead';
export type BotState = 'patrol' | 'chase' | 'attack' | 'flee' | 'collect-gem' | 'defend';
export type ControlMode = 'keyboard' | 'touch';

export interface RobotStats {
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  attackRange: number;
  attackSpeed: number;
  specialCooldown: number;
  specialDamage: number;
  armor: number;
}

export interface Robot {
  id: RobotId;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  unlocked: boolean;
  stats: RobotStats;
  specialName: string;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Projectile {
  id: string;
  position: Vec3;
  velocity: Vec3;
  damage: number;
  ownerId: string;
  type: 'bullet' | 'beam' | 'rocket' | 'orb';
  lifetime: number;
}

export interface Gem {
  id: string;
  position: Vec3;
  collected: boolean;
  holderId: string | null;
}

export interface Player {
  id: string;
  name: string;
  robotId: RobotId;
  position: Vec3;
  rotation: number;
  health: number;
  maxHealth: number;
  gems: number;
  state: RobotState;
  isBot: boolean;
  lastAttackTime: number;
  lastSpecialTime: number;
  score: number;
}

export interface MatchConfig {
  mode: GameMode;
  playerRobotId: RobotId;
  botCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  mapSize: 'small' | 'medium' | 'large';
}

export interface MatchResult {
  winner: string;
  playerPlacement: number;
  gemsCollected: number;
  damageDealt: number;
  robotsDefeated: number;
  coinsEarned: number;
  xpEarned: number;
}

export interface Progression {
  coins: number;
  xp: number;
  level: number;
  unlockedRobots: RobotId[];
  matchesPlayed: number;
  totalWins: number;
  totalGems: number;
}

export interface HeistBase {
  id: string;
  position: Vec3;
  health: number;
  maxHealth: number;
  team: 'player' | 'enemy';
}
