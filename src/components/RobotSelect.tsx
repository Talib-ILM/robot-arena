// ==========================================
// RobotSelect Component
// ==========================================

import React, { useState } from 'react';
import { useGameStore } from '../context/GameStore';
import { ROBOTS, UNLOCK_COSTS } from '../data/robots';
import { RobotId } from '../types';

export function RobotSelect() {
  const { setGameState, setMatchConfig, progression, unlockRobot } = useGameStore();
  const [selectedRobot, setSelectedRobot] = useState<RobotId>(
    progression.unlockedRobots[0] || 'bolt'
  );
  const [showUnlock, setShowUnlock] = useState(false);

  const robot = ROBOTS[selectedRobot];
  const isUnlocked = progression.unlockedRobots.includes(selectedRobot);

  const handleSelect = () => {
    setMatchConfig({ playerRobotId: selectedRobot });
    setGameState('match-lobby');
  };

  const handleUnlock = () => {
    const cost = UNLOCK_COSTS[progression.unlockedRobots.length] || 2000;
    if (progression.coins >= cost) {
      useGameStore.getState().addCoins(-cost);
      unlockRobot(selectedRobot);
      setShowUnlock(false);
    }
  };

  const unlockCost = UNLOCK_COSTS[progression.unlockedRobots.length] || 2000;

  return (
    <div className="robot-select">
      <div className="select-container">
        <h2 className="select-title">CHOOSE YOUR ROBOT</h2>

        <div className="robot-grid">
          {(Object.keys(ROBOTS) as RobotId[]).map((id) => {
            const r = ROBOTS[id];
            const unlocked = progression.unlockedRobots.includes(id);
            return (
              <button
                key={id}
                className={`robot-card ${selectedRobot === id ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                onClick={() => setSelectedRobot(id)}
              >
                <div
                  className="robot-preview"
                  style={{ backgroundColor: r.color }}
                >
                  <div className="robot-icon">{r.name[0]}</div>
                  {!unlocked && <div className="lock-overlay">🔒</div>}
                </div>
                <div className="robot-name">{r.name}</div>
                <div className="robot-type">
                  {id === 'bolt' ? 'Scout' : id === 'tank' ? 'Tank' : id === 'spark' ? 'Tech' : 'Drone'}
                </div>
              </button>
            );
          })}
        </div>

        <div className="robot-info">
          <div className="info-header">
            <h3 style={{ color: robot.color }}>{robot.name}</h3>
            <span className="robot-special">{robot.specialName}</span>
          </div>
          <p className="robot-desc">{robot.description}</p>

          <div className="stats-grid">
            <div className="stat-bar">
              <span className="stat-label">HP</span>
              <div className="bar-bg">
                <div
                  className="bar-fill hp-bar"
                  style={{ width: `${(robot.stats.maxHealth / 1500) * 100}%` }}
                />
              </div>
              <span className="stat-val">{robot.stats.maxHealth}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">DMG</span>
              <div className="bar-bg">
                <div
                  className="bar-fill dmg-bar"
                  style={{ width: `${(robot.stats.damage / 150) * 100}%` }}
                />
              </div>
              <span className="stat-val">{robot.stats.damage}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">SPD</span>
              <div className="bar-bg">
                <div
                  className="bar-fill spd-bar"
                  style={{ width: `${(robot.stats.speed / 8) * 100}%` }}
                />
              </div>
              <span className="stat-val">{robot.stats.speed}</span>
            </div>
            <div className="stat-bar">
              <span className="stat-label">RNG</span>
              <div className="bar-bg">
                <div
                  className="bar-fill rng-bar"
                  style={{ width: `${(robot.stats.attackRange / 14) * 100}%` }}
                />
              </div>
              <span className="stat-val">{robot.stats.attackRange}</span>
            </div>
          </div>
        </div>

        <div className="select-actions">
          <button className="menu-btn back-btn" onClick={() => setGameState('menu')}>
            ← Back
          </button>
          {isUnlocked ? (
            <button className="menu-btn play-btn" onClick={handleSelect}>
              SELECT & PLAY →
            </button>
          ) : (
            <button
              className="menu-btn unlock-btn"
              onClick={() => setShowUnlock(true)}
            >
              🔒 Unlock ({unlockCost} coins)
            </button>
          )}
        </div>

        {showUnlock && (
          <div className="unlock-modal">
            <div className="modal-content">
              <h3>Unlock {robot.name}?</h3>
              <p>Cost: {unlockCost} coins</p>
              <p>Your coins: {progression.coins}</p>
              <div className="modal-actions">
                <button
                  className="menu-btn"
                  onClick={handleUnlock}
                  disabled={progression.coins < unlockCost}
                >
                  Unlock
                </button>
                <button className="menu-btn" onClick={() => setShowUnlock(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
