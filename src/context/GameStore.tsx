// ==========================================
// Game State Store (Zustand)
// ==========================================

import { create } from 'zustand';
import {
  GameState,
  GameMode,
  RobotId,
  Player,
  Projectile,
  Gem,
  MatchConfig,
  MatchResult,
  Progression,
  HeistBase,
  Vec3,
} from '../types';
import { ROBOTS } from '../data/robots';

interface GameStore {
  // Navigation
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Match Config
  matchConfig: MatchConfig;
  setMatchConfig: (config: Partial<MatchConfig>) => void;

  // Players
  player: Player;
  bots: Player[];
  setPlayer: (player: Partial<Player>) => void;
  setBots: (bots: Player[]) => void;
  updateBot: (id: string, update: Partial<Player>) => void;

  // Projectiles
  projectiles: Projectile[];
  addProjectile: (proj: Projectile) => void;
  removeProjectile: (id: string) => void;
  updateProjectiles: (dt: number) => void;

  // Gems
  gems: Gem[];
  setGems: (gems: Gem[]) => void;
  collectGem: (gemId: string, playerId: string) => void;

  // Heist bases
  heistBases: HeistBase[];
  setHeistBases: (bases: HeistBase[]) => void;
  damageBase: (baseId: string, damage: number) => void;

  // Match state
  matchTime: number;
  setMatchTime: (time: number) => void;
  matchResult: MatchResult | null;
  setMatchResult: (result: MatchResult | null) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;

  // Progression
  progression: Progression;
  updateProgression: (update: Partial<Progression>) => void;
  addCoins: (amount: number) => void;
  unlockRobot: (robotId: RobotId) => void;

  // Settings
  controlMode: 'keyboard' | 'touch';
  setControlMode: (mode: 'keyboard' | 'touch') => void;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  toggleMusic: () => void;
  toggleSfx: () => void;

  // Damage numbers
  damageNumbers: { id: string; position: Vec3; value: number; time: number }[];
  addDamageNumber: (position: Vec3, value: number) => void;
  clearOldDamageNumbers: () => void;

  // Reset match
  resetMatch: () => void;
}

const defaultProgression: Progression = {
  coins: 0,
  xp: 0,
  level: 1,
  unlockedRobots: ['bolt'],
  matchesPlayed: 0,
  totalWins: 0,
  totalGems: 0,
};

const loadProgression = (): Progression => {
  try {
    const saved = localStorage.getItem('robot-arena-progress');
    return saved ? { ...defaultProgression, ...JSON.parse(saved) } : defaultProgression;
  } catch {
    return defaultProgression;
  }
};

const saveProgression = (p: Progression) => {
  try {
    localStorage.setItem('robot-arena-progress', JSON.stringify(p));
  } catch { /* ignore */ }
};

const defaultPlayer: Player = {
  id: 'player-1',
  name: 'You',
  robotId: 'bolt',
  position: { x: 0, y: 0, z: 10 },
  rotation: 0,
  health: ROBOTS.bolt.stats.maxHealth,
  maxHealth: ROBOTS.bolt.stats.maxHealth,
  gems: 0,
  state: 'idle',
  isBot: false,
  lastAttackTime: 0,
  lastSpecialTime: 0,
  score: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'menu',
  setGameState: (gameState) => set({ gameState }),

  matchConfig: {
    mode: 'gem-grab',
    playerRobotId: 'bolt',
    botCount: 3,
    difficulty: 'medium',
    mapSize: 'medium',
  },
  setMatchConfig: (config) =>
    set((s) => ({ matchConfig: { ...s.matchConfig, ...config } })),

  player: { ...defaultPlayer },
  bots: [],
  setPlayer: (player) =>
    set((s) => ({ player: { ...s.player, ...player } })),
  setBots: (bots) => set({ bots }),
  updateBot: (id, update) =>
    set((s) => ({
      bots: s.bots.map((b) => (b.id === id ? { ...b, ...update } : b)),
    })),

  projectiles: [],
  addProjectile: (proj) =>
    set((s) => ({ projectiles: [...s.projectiles, proj] })),
  removeProjectile: (id) =>
    set((s) => ({ projectiles: s.projectiles.filter((p) => p.id !== id) })),
  updateProjectiles: (dt) =>
    set((s) => ({
      projectiles: s.projectiles
        .map((p) => ({
          ...p,
          position: {
            x: p.position.x + p.velocity.x * dt,
            y: p.position.y + p.velocity.y * dt,
            z: p.position.z + p.velocity.z * dt,
          },
          lifetime: p.lifetime - dt,
        }))
        .filter((p) => p.lifetime > 0),
    })),

  gems: [],
  setGems: (gems) => set({ gems }),
  collectGem: (gemId, playerId) =>
    set((s) => {
      const gems = s.gems.map((g) =>
        g.id === gemId ? { ...g, collected: true, holderId: playerId } : g
      );
      const isPlayer = playerId === s.player.id;
      const player = isPlayer
        ? { ...s.player, gems: s.player.gems + 1 }
        : s.player;
      const bots = s.bots.map((b) =>
        b.id === playerId ? { ...b, gems: b.gems + 1 } : b
      );
      return { gems, player, bots };
    }),

  heistBases: [],
  setHeistBases: (bases) => set({ heistBases: bases }),
  damageBase: (baseId, damage) =>
    set((s) => ({
      heistBases: s.heistBases.map((b) =>
        b.id === baseId ? { ...b, health: Math.max(0, b.health - damage) } : b
      ),
    })),

  matchTime: 0,
  setMatchTime: (matchTime) => set({ matchTime }),
  matchResult: null,
  setMatchResult: (matchResult) => set({ matchResult }),
  isPaused: false,
  setPaused: (isPaused) => set({ isPaused }),

  progression: loadProgression(),
  updateProgression: (update) =>
    set((s) => {
      const progression = { ...s.progression, ...update };
      saveProgression(progression);
      return { progression };
    }),
  addCoins: (amount) =>
    set((s) => {
      const progression = { ...s.progression, coins: s.progression.coins + amount };
      saveProgression(progression);
      return { progression };
    }),
  unlockRobot: (robotId) =>
    set((s) => {
      const unlocked = [...s.progression.unlockedRobots, robotId];
      const progression = { ...s.progression, unlockedRobots: unlocked };
      saveProgression(progression);
      return { progression };
    }),

  controlMode: 'keyboard',
  setControlMode: (controlMode) => set({ controlMode }),
  musicEnabled: true,
  sfxEnabled: true,
  toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
  toggleSfx: () => set((s) => ({ sfxEnabled: !s.sfxEnabled })),

  damageNumbers: [],
  addDamageNumber: (position, value) =>
    set((s) => ({
      damageNumbers: [
        ...s.damageNumbers,
        { id: `dmg-${Date.now()}-${Math.random()}`, position, value, time: 1.0 },
      ],
    })),
  clearOldDamageNumbers: () =>
    set((s) => ({
      damageNumbers: s.damageNumbers.filter((d) => d.time > 0),
    })),

  resetMatch: () =>
    set({
      player: { ...defaultPlayer },
      bots: [],
      projectiles: [],
      gems: [],
      heistBases: [],
      matchTime: 0,
      matchResult: null,
      isPaused: false,
      damageNumbers: [],
    }),
}));
