// ==========================================
// Results Screen
// ==========================================

import React from 'react';
import { useGameStore } from '../context/GameStore';
import { ROBOTS } from '../data/robots';

export function Results() {
  const { matchResult, setGameState, resetMatch, player, matchConfig } = useGameStore();
  const robot = ROBOTS[player.robotId];

  if (!matchResult) return null;

  const isWin = matchResult.winner === 'player';

  const handlePlayAgain = () => {
    resetMatch();
    setGameState('match-lobby');
  };

  const handleMenu = () => {
    resetMatch();
    setGameState('menu');
  };

  // Update progression
  React.useEffect(() => {
    const store = useGameStore.getState();
    store.updateProgression({
      matchesPlayed: store.progression.matchesPlayed + 1,
      totalWins: store.progression.totalWins + (isWin ? 1 : 0),
      totalGems: store.progression.totalGems + matchResult.gemsCollected,
    });
    store.addCoins(matchResult.coinsEarned);
    store.updateProgression({
      xp: store.progression.xp + matchResult.xpEarned,
      level: Math.floor((store.progression.xp + matchResult.xpEarned) / 500) + 1,
    });
  }, []);

  return (
    <div className="results-screen">
      <div className="results-container">
        <div className={`results-header ${isWin ? 'win' : 'loss'}`}>
          <h1>{isWin ? '🏆 VICTORY!' : '💀 DEFEAT'}</h1>
          <p className="placement">
            {matchResult.playerPlacement === 1
              ? '1st Place'
              : `${matchResult.playerPlacement}${matchResult.playerPlacement === 2 ? 'nd' : matchResult.playerPlacement === 3 ? 'rd' : 'th'} Place`}
          </p>
        </div>

        <div className="results-robot">
          <div
            className="results-robot-preview"
            style={{ backgroundColor: robot.color }}
          >
            {robot.name[0]}
          </div>
          <span>{robot.name}</span>
        </div>

        <div className="results-stats">
          <div className="result-stat">
            <span className="result-label">💎 Gems Collected</span>
            <span className="result-value">{matchResult.gemsCollected}</span>
          </div>
          <div className="result-stat">
            <span className="result-label">⚔️ Robots Defeated</span>
            <span className="result-value">{matchResult.robotsDefeated}</span>
          </div>
          <div className="result-stat">
            <span className="result-label">🪙 Coins Earned</span>
            <span className="result-value">+{matchResult.coinsEarned}</span>
          </div>
          <div className="result-stat">
            <span className="result-label">⭐ XP Earned</span>
            <span className="result-value">+{matchResult.xpEarned}</span>
          </div>
        </div>

        <div className="results-actions">
          <button className="menu-btn play-btn" onClick={handlePlayAgain}>
            Play Again
          </button>
          <button className="menu-btn" onClick={handleMenu}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
