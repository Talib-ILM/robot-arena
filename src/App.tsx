import React from 'react';
import { useGameStore } from './context/GameStore';
import { MainMenu } from './components/MainMenu';
import { RobotSelect } from './components/RobotSelect';
import { MatchLobby } from './components/MatchLobby';
import { Game } from './components/Game';
import { Results } from './components/Results';

export function App() {
  const gameState = useGameStore((s) => s.gameState);

  switch (gameState) {
    case 'menu':
      return <MainMenu />;
    case 'robot-select':
      return <RobotSelect />;
    case 'match-lobby':
      return <MatchLobby />;
    case 'playing':
      return <Game />;
    case 'results':
      return <Results />;
    default:
      return <MainMenu />;
  }
}
