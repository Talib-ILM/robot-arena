// ==========================================
// useGameLoop - Main Game Loop
// ==========================================

import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../context/GameStore';
import { ROBOTS } from '../data/robots';
import { AI_DIFFICULTY } from '../data/botNames';
import { Player, Vec3 } from '../types';

let damageIdCounter = 0;

function distance(a: Vec3, b: Vec3): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function useGameLoop() {
  const store = useGameStore();
  const lastAttackRef = useRef(0);

  const updatePlayer = useCallback(
    (keys: { forward: boolean; backward: boolean; left: boolean; right: boolean; attack: boolean; special: boolean }, dt: number) => {
      const { player, matchConfig } = useGameStore.getState();
      const robot = ROBOTS[matchConfig.playerRobotId];
      const stats = robot.stats;

      let dx = 0;
      let dz = 0;
      if (keys.forward) dz -= 1;
      if (keys.backward) dz += 1;
      if (keys.left) dx -= 1;
      if (keys.right) dx += 1;

      const len = Math.sqrt(dx * dx + dz * dz);
      let newPos = { ...player.position };
      let newRotation = player.rotation;

      if (len > 0) {
        dx /= len;
        dz /= len;
        newPos.x += dx * stats.speed * dt;
        newPos.z += dz * stats.speed * dt;
        newRotation = Math.atan2(dx, -dz);
      }

      const mapSize = 30;
      newPos.x = clamp(newPos.x, -mapSize, mapSize);
      newPos.z = clamp(newPos.z, -mapSize, mapSize);

      const state = len > 0 ? 'moving' : 'idle';
      useGameStore.getState().setPlayer({
        position: newPos,
        rotation: newRotation,
        state,
      });

      // Handle attack
      const now = performance.now() / 1000;
      if (keys.attack && now - player.lastAttackTime >= stats.attackSpeed) {
        const angle = newRotation;
        const spawnPos = {
          x: newPos.x + Math.sin(angle) * 1.5,
          y: 0.5,
          z: newPos.z - Math.cos(angle) * 1.5,
        };
        useGameStore.getState().addProjectile({
          id: `proj-${++damageIdCounter}`,
          position: spawnPos,
          velocity: {
            x: Math.sin(angle) * 20,
            y: 0,
            z: -Math.cos(angle) * 20,
          },
          damage: stats.damage,
          ownerId: player.id,
          type: 'bullet',
          lifetime: 1.5,
        });
        useGameStore.getState().setPlayer({ lastAttackTime: now });
      }

      // Handle special
      if (keys.special && now - player.lastSpecialTime >= stats.specialCooldown) {
        const angle = newRotation;
        for (let i = -2; i <= 2; i++) {
          const spread = i * 0.3;
          const spawnPos = {
            x: newPos.x + Math.sin(angle + spread) * 1.5,
            y: 0.5,
            z: newPos.z - Math.cos(angle + spread) * 1.5,
          };
          useGameStore.getState().addProjectile({
            id: `proj-${++damageIdCounter}`,
            position: spawnPos,
            velocity: {
              x: Math.sin(angle + spread) * 25,
              y: 0,
              z: -Math.cos(angle + spread) * 25,
            },
            damage: stats.specialDamage / 5,
            ownerId: player.id,
            type: 'orb',
            lifetime: 1.0,
          });
        }
        useGameStore.getState().setPlayer({ lastSpecialTime: now });
      }
    },
    []
  );

  const updateBots = useCallback((dt: number) => {
    const state = useGameStore.getState();
    const { bots, player, gems, matchConfig } = state;
    const diffSettings = AI_DIFFICULTY[matchConfig.difficulty];

    for (const bot of bots) {
      if (bot.state === 'dead') continue;

      const robot = ROBOTS[bot.robotId];
      const stats = robot.stats;
      const now = performance.now() / 1000;

      // Simple AI: move toward player if close, otherwise patrol
      let targetX = bot.position.x + (Math.random() - 0.5) * 2;
      let targetZ = bot.position.z + (Math.random() - 0.5) * 2;

      const distToPlayer = distance(bot.position, player.position);

      if (distToPlayer < stats.attackRange && Math.random() < diffSettings.aggression) {
        // Chase player
        const dx = player.position.x - bot.position.x;
        const dz = player.position.z - bot.position.z;
        const len = Math.sqrt(dx * dx + dz * dz);
        if (len > 0) {
          targetX = bot.position.x + (dx / len) * stats.speed * dt;
          targetZ = bot.position.z + (dz / len) * stats.speed * dt;
        }
      }

      // Move toward target
      const dx = targetX - bot.position.x;
      const dz = targetZ - bot.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      let newPos = { ...bot.position };
      let newRotation = bot.rotation;

      if (dist > 0.5) {
        const moveX = (dx / dist) * stats.speed * dt;
        const moveZ = (dz / dist) * stats.speed * dt;
        newPos.x += moveX;
        newPos.z += moveZ;
        newRotation = Math.atan2(dx, -dz);
      }

      const mapSize = 30;
      newPos.x = clamp(newPos.x, -mapSize, mapSize);
      newPos.z = clamp(newPos.z, -mapSize, mapSize);

      // Attack
      if (distToPlayer < stats.attackRange && now - bot.lastAttackTime >= stats.attackSpeed) {
        if (Math.random() < diffSettings.accuracy) {
          const angle = Math.atan2(
            player.position.x - bot.position.x,
            -(player.position.z - bot.position.z)
          );
          const spawnPos = {
            x: newPos.x + Math.sin(angle) * 1.5,
            y: 0.5,
            z: newPos.z - Math.cos(angle) * 1.5,
          };
          useGameStore.getState().addProjectile({
            id: `proj-${++damageIdCounter}`,
            position: spawnPos,
            velocity: {
              x: Math.sin(angle) * 18,
              y: 0,
              z: -Math.cos(angle) * 18,
            },
            damage: stats.damage * 0.8,
            ownerId: bot.id,
            type: 'bullet',
            lifetime: 1.5,
          });
          useGameStore.getState().updateBot(bot.id, {
            lastAttackTime: now,
          });
        }
      }

      useGameStore.getState().updateBot(bot.id, {
        position: newPos,
        rotation: newRotation,
        state: dist > 0.5 ? 'moving' : 'idle',
      });
    }
  }, []);

  const checkCollisions = useCallback(() => {
    const state = useGameStore.getState();
    const { projectiles, player, bots } = state;

    for (const proj of projectiles) {
      // Player projectiles hitting bots
      if (proj.ownerId === player.id) {
        for (const bot of bots) {
          if (bot.state === 'dead') continue;
          const dist = distance(proj.position, bot.position);
          if (dist < 1.5) {
            const robot = ROBOTS[bot.robotId];
            const actualDamage = Math.max(1, proj.damage - robot.stats.armor);
            const newHealth = Math.max(0, bot.health - actualDamage);
            useGameStore.getState().updateBot(bot.id, {
              health: newHealth,
              state: newHealth <= 0 ? 'dead' : 'damaged',
            });
            useGameStore.getState().addDamageNumber(bot.position, actualDamage);
            useGameStore.getState().removeProjectile(proj.id);
            break;
          }
        }
      }
      // Bot projectiles hitting player
      else if (proj.ownerId !== player.id && player.state !== 'dead') {
        const dist = distance(proj.position, player.position);
        if (dist < 1.5) {
          const robot = ROBOTS[player.robotId];
          const actualDamage = Math.max(1, proj.damage - robot.stats.armor);
          const newHealth = Math.max(0, player.health - actualDamage);
          useGameStore.getState().setPlayer({
            health: newHealth,
            state: newHealth <= 0 ? 'dead' : 'damaged',
          });
          useGameStore.getState().addDamageNumber(player.position, actualDamage);
          useGameStore.getState().removeProjectile(proj.id);
        }
      }
    }
  }, []);

  const checkWinConditions = useCallback(() => {
    const state = useGameStore.getState();
    const { matchConfig, player, bots, matchTime, gems } = state;

    if (matchConfig.mode === 'gem-grab') {
      if (player.gems >= 10) {
        useGameStore.getState().setMatchResult({
          winner: 'player',
          playerPlacement: 1,
          gemsCollected: player.gems,
          damageDealt: 0,
          robotsDefeated: bots.filter((b) => b.state === 'dead').length,
          coinsEarned: 100,
          xpEarned: 50,
        });
        useGameStore.getState().setGameState('results');
      }
    } else if (matchConfig.mode === 'showdown') {
      const aliveBots = bots.filter((b) => b.state !== 'dead');
      if (aliveBots.length === 0 && player.state !== 'dead') {
        useGameStore.getState().setMatchResult({
          winner: 'player',
          playerPlacement: 1,
          gemsCollected: 0,
          damageDealt: 0,
          robotsDefeated: bots.length,
          coinsEarned: 200,
          xpEarned: 100,
        });
        useGameStore.getState().setGameState('results');
      }
    }

    if (matchTime <= 0 && matchConfig.mode !== 'showdown') {
      useGameStore.getState().setMatchResult({
        winner: 'draw',
        playerPlacement: 2,
        gemsCollected: player.gems,
        damageDealt: 0,
        robotsDefeated: bots.filter((b) => b.state === 'dead').length,
        coinsEarned: 50,
        xpEarned: 25,
      });
      useGameStore.getState().setGameState('results');
    }
  }, []);

  return {
    updatePlayer,
    updateBots,
    checkCollisions,
    checkWinConditions,
  };
}
