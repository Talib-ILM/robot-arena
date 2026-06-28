// ==========================================
// HUD - Heads-Up Display
// ==========================================

import React from 'react';
import { useGameStore } from '../context/GameStore';
import { ROBOTS } from '../data/robots';

export function HUD() {
  const { player, matchTime, matchConfig, isPaused, setPaused, bots } = useGameStore();
  const robot = ROBOTS[player.robotId];

  const healthPercent = (player.health / player.maxHealth) * 100;
  const specialCooldown = useGameStore((s) => {
    const now = performance.now() / 1000;
    const elapsed = now - player.lastSpecialTime;
    return Math.max(0, 1 - elapsed / robot.stats.specialCooldown);
  });

  const minutes = Math.floor(matchTime / 60);
  const seconds = Math.floor(matchTime % 60);

  return (
    <div className="hud">
      {/* Top bar */}
      <div className="hud-top">
        <div className="hud-timer">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <div className="hud-mode">{matchConfig.mode.replace('-', ' ').toUpperCase()}</div>
        <div className="hud-alive">
          Alive: {bots.filter((b) => b.state !== 'dead').length + (player.state !== 'dead' ? 1 : 0)}
        </div>
      </div>

      {/* Player info */}
      <div className="hud-bottom">
        <div className="hud-player">
          <div
            className="hud-robot-icon"
            style={{ backgroundColor: robot.color }}
          >
            {robot.name[0]}
          </div>
          <div className="hud-player-info">
            <div className="hud-health-bar">
              <div
                className="hud-health-fill"
                style={{
                  width: `${healthPercent}%`,
                  backgroundColor:
                    healthPercent > 50 ? '#22c55e' : healthPercent > 25 ? '#eab308' : '#ef4444',
                }}
              />
              <span className="hud-health-text">
                {Math.ceil(player.health)} / {player.maxHealth}
              </span>
            </div>
            {matchConfig.mode === 'gem-grab' && (
              <div className="hud-gems">
                💎 {player.gems}
              </div>
            )}
          </div>
        </div>

        <div className="hud-abilities">
          <div className="ability-btn attack-btn">
            <span className="ability-key">SPACE</span>
            <span className="ability-label">Attack</span>
          </div>
          <div
            className={`ability-btn special-btn ${specialCooldown > 0 ? 'cooldown' : ''}`}
          >
            <div
              className="cooldown-overlay"
              style={{ height: `${specialCooldown * 100}%` }}
            />
            <span className="ability-key">E</span>
            <span className="ability-label">{robot.specialName}</span>
          </div>
        </div>
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="pause-overlay">
          <div className="pause-menu">
            <h2>PAUSED</h2>
            <button className="menu-btn" onClick={() => setPaused(false)}>
              Resume
            </button>
            <button
              className="menu-btn"
              onClick={() => {
                setPaused(false);
                useGameStore.getState().setGameState('menu');
              }}
            >
              Quit to Menu
            </button>
          </div>
        </div>
      )}

      {/* Damage numbers */}
      <div className="damage-numbers">
        {useGameStore.getState().damageNumbers.map((dmg) => (
          <div
            key={dmg.id}
            className="damage-number"
            style={{
              left: `${50 + (dmg.position.x / 30) * 30}%`,
              top: `${30 + (dmg.position.z / 30) * 20}%`,
            }}
          >
            -{Math.round(dmg.value)}
          </div>
        ))}
      </div>
    </div>
  );
}
