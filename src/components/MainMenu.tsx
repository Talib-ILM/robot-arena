// ==========================================
// MainMenu Component
// ==========================================

import React from 'react';
import { useGameStore } from '../context/GameStore';
import { GAME_MODES } from '../data/gameModes';

export function MainMenu() {
  const { setGameState, setMatchConfig, progression } = useGameStore();

  return (
    <div className="main-menu">
      <div className="menu-container">
        <div className="logo-section">
          <h1 className="game-title">ROBOT ARENA</h1>
          <p className="game-subtitle">Brawl Stars Clone</p>
        </div>

        <div className="stats-bar">
          <div className="stat">
            <span className="stat-icon">💰</span>
            <span className="stat-value">{progression.coins}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">Lv. {progression.level}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">🏆</span>
            <span className="stat-value">{progression.totalWins}</span>
          </div>
        </div>

        <div className="menu-buttons">
          <button
            className="menu-btn play-btn"
            onClick={() => setGameState('robot-select')}
          >
            <span className="btn-icon">🎮</span>
            <span className="btn-text">PLAY</span>
          </button>

          {GAME_MODES.map((mode) => (
            <button
              key={mode.id}
              className="menu-btn mode-btn"
              onClick={() => {
                setMatchConfig({ mode: mode.id });
                setGameState('robot-select');
              }}
            >
              <span className="btn-icon">{mode.icon}</span>
              <span className="btn-text">{mode.name}</span>
              <span className="btn-desc">{mode.description}</span>
            </button>
          ))}
        </div>

        <div className="menu-footer">
          <p>WASD to move • Space to shoot • E for special</p>
          <p>Touch controls available on mobile</p>
        </div>
      </div>
    </div>
  );
}
