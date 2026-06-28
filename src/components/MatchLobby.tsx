// ==========================================
// MatchLobby Component
// ==========================================

import React from 'react';
import { useGameStore } from '../context/GameStore';
import { ROBOTS } from '../data/robots';
import { GAME_MODES } from '../data/gameModes';
import { BOT_NAMES } from '../data/botNames';
import { Player, RobotId } from '../types';

function generateBots(playerRobotId: RobotId, count: number): Player[] {
  const robotIds: RobotId[] = ['bolt', 'tank', 'spark', 'hex'].filter(
    (id) => id !== playerRobotId
  ) as RobotId[];
  const shuffledNames = [...BOT_NAMES].sort(() => Math.random() - 0.5);

  return Array.from({ length: count }, (_, i) => {
    const robotId = robotIds[i % robotIds.length];
    const robot = ROBOTS[robotId];
    const angle = (Math.PI * 2 * i) / count;
    const dist = 10 + Math.random() * 5;

    return {
      id: `bot-${i}`,
      name: shuffledNames[i] || `Bot ${i + 1}`,
      robotId,
      position: {
        x: Math.sin(angle) * dist,
        y: 0,
        z: Math.cos(angle) * dist,
      },
      rotation: 0,
      health: robot.stats.maxHealth,
      maxHealth: robot.stats.maxHealth,
      gems: 0,
      state: 'idle' as const,
      isBot: true,
      lastAttackTime: 0,
      lastSpecialTime: 0,
      score: 0,
    };
  });
}

export function MatchLobby() {
  const { matchConfig, setGameState, setBots, setPlayer, setMatchTime, resetMatch } =
    useGameStore();
  const mode = GAME_MODES.find((m) => m.id === matchConfig.mode);
  const robot = ROBOTS[matchConfig.playerRobotId];

  const handleStart = () => {
    resetMatch();
    const playerPos = { x: 0, y: 0, z: 12 };
    setPlayer({
      position: playerPos,
      health: robot.stats.maxHealth,
      maxHealth: robot.stats.maxHealth,
      state: 'idle',
      gems: 0,
    });
    setBots(generateBots(matchConfig.playerRobotId, matchConfig.botCount));
    setMatchTime(mode?.timeLimit || 180);
    setGameState('playing');
  };

  return (
    <div className="match-lobby">
      <div className="lobby-container">
        <h2 className="lobby-title">MATCH LOBBY</h2>

        <div className="lobby-info">
          <div className="lobby-mode">
            <span className="mode-icon">{mode?.icon}</span>
            <span className="mode-name">{mode?.name}</span>
          </div>
          <div className="lobby-map">
            Map: {matchConfig.mapSize.charAt(0).toUpperCase() + matchConfig.mapSize.slice(1)}
          </div>
          <div className="lobby-difficulty">
            Difficulty: {matchConfig.difficulty.charAt(0).toUpperCase() + matchConfig.difficulty.slice(1)}
          </div>
        </div>

        <div className="player-card">
          <div
            className="player-robot-preview"
            style={{ backgroundColor: robot.color }}
          >
            <div className="robot-letter">{robot.name[0]}</div>
          </div>
          <div className="player-details">
            <h3>{robot.name}</h3>
            <p>You ({robot.specialName})</p>
          </div>
        </div>

        <div className="bot-list">
          <h4>Opponents ({matchConfig.botCount})</h4>
          {Array.from({ length: matchConfig.botCount }, (_, i) => {
            const robotIds: RobotId[] = ['bolt', 'tank', 'spark', 'hex'].filter(
              (id) => id !== matchConfig.playerRobotId
            ) as RobotId[];
            const rid = robotIds[i % robotIds.length];
            const r = ROBOTS[rid];
            return (
              <div key={i} className="bot-card">
                <div
                  className="bot-avatar"
                  style={{ backgroundColor: r.color }}
                >
                  {r.name[0]}
                </div>
                <span className="bot-name">{BOT_NAMES[i] || `Bot ${i + 1}`}</span>
                <span className="bot-robot">{r.name}</span>
              </div>
            );
          })}
        </div>

        <div className="lobby-settings">
          <label>
            Bots:
            <select
              value={matchConfig.botCount}
              onChange={(e) =>
                useGameStore.getState().setMatchConfig({
                  botCount: parseInt(e.target.value),
                })
              }
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <label>
            Difficulty:
            <select
              value={matchConfig.difficulty}
              onChange={(e) =>
                useGameStore.getState().setMatchConfig({
                  difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label>
            Map:
            <select
              value={matchConfig.mapSize}
              onChange={(e) =>
                useGameStore.getState().setMatchConfig({
                  mapSize: e.target.value as 'small' | 'medium' | 'large',
                })
              }
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
        </div>

        <div className="lobby-actions">
          <button className="menu-btn back-btn" onClick={() => setGameState('robot-select')}>
            ← Back
          </button>
          <button className="menu-btn play-btn start-btn" onClick={handleStart}>
            START MATCH 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
