// ==========================================
// Game - Main 3D Scene Component
// ==========================================

import React, { useRef, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../context/GameStore';
import { useKeyboard } from '../hooks/useKeyboard';
import { useGameLoop } from '../hooks/useGameLoop';
import { RobotModel } from '../models/RobotModel';
import { GemModel } from '../models/GemModel';
import { ProjectileModel } from '../models/ProjectileModel';
import { Arena } from '../arena/Arena';
import { HeistBaseModel } from '../arena/HeistBase';
import { PowerCube } from '../arena/PowerCube';
import { MAP_CONFIGS } from '../data/gameModes';
import { HUD } from './HUD';
import { TouchControls } from './TouchControls';

function GameScene() {
  const keys = useKeyboard();
  const { updatePlayer, updateBots, checkCollisions, checkWinConditions } = useGameLoop();
  const store = useGameStore();
  const { player, bots, projectiles, gems, matchConfig, matchTime, isPaused, setPaused, setMatchTime, heistBases } = store;
  const touchMoveRef = useRef({ x: 0, y: 0 });
  const touchAttackRef = useRef(false);
  const touchSpecialRef = useRef(false);

  const handleTouchMove = useCallback((x: number, y: number) => {
    touchMoveRef.current = { x, y };
  }, []);

  const handleTouchAttack = useCallback((active: boolean) => {
    touchAttackRef.current = active;
  }, []);

  const handleTouchSpecial = useCallback((active: boolean) => {
    touchSpecialRef.current = active;
  }, []);

  useFrame((state, delta) => {
    if (isPaused || store.gameState !== 'playing') return;

    const dt = Math.min(delta, 0.05);

    // Update timer
    setMatchTime(matchTime - dt);

    // Merge keyboard and touch input
    const moveKeys = {
      forward: keys.current.forward || touchMoveRef.current.y < -0.3,
      backward: keys.current.backward || touchMoveRef.current.y > 0.3,
      left: keys.current.left || touchMoveRef.current.x < -0.3,
      right: keys.current.right || touchMoveRef.current.x > 0.3,
      attack: keys.current.attack || touchAttackRef.current,
      special: keys.current.special || touchSpecialRef.current,
    };

    // Handle pause
    if (keys.current.pause) {
      setPaused(!isPaused);
      keys.current.pause = false;
    }

    // Update game entities
    updatePlayer(moveKeys, dt);
    updateBots(dt);
    store.updateProjectiles(dt);
    checkCollisions();
    checkWinConditions();
    store.clearOldDamageNumbers();

    // Clear touch inputs after processing
    touchAttackRef.current = false;
    touchSpecialRef.current = false;
  });

  // Camera follow
  const { camera } = useThree();
  useFrame(() => {
    const targetPos = new THREE.Vector3(player.position.x, 15, player.position.z + 12);
    camera.position.lerp(targetPos, 0.05);
    camera.lookAt(player.position.x, 0, player.position.z);
  });

  const mapConfig = MAP_CONFIGS[matchConfig.mapSize] || MAP_CONFIGS.medium;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#6366f1" />

      {/* Arena */}
      <Arena mapSize={matchConfig.mapSize} />

      {/* Player */}
      <RobotModel
        robotId={player.robotId}
        player={player}
        isPlayer={true}
      />

      {/* Bots */}
      {bots.map((bot) => (
        <RobotModel
          key={bot.id}
          robotId={bot.robotId}
          player={bot}
        />
      ))}

      {/* Projectiles */}
      {projectiles.map((proj) => (
        <ProjectileModel key={proj.id} projectile={proj} />
      ))}

      {/* Gems (Gem Grab mode) */}
      {matchConfig.mode === 'gem-grab' &&
        gems.map((gem) => (
          <GemModel key={gem.id} gem={gem} />
        ))}

      {/* Power Cubes (Showdown mode) */}
      {matchConfig.mode === 'showdown' &&
        mapConfig.powerCubeSpawns.map((pos, i) => (
          <PowerCube
            key={`pc-${i}`}
            position={pos}
            collected={false}
          />
        ))}

      {/* Heist Bases */}
      {matchConfig.mode === 'heist' &&
        heistBases.map((base) => (
          <HeistBaseModel key={base.id} base={base} />
        ))}

      {/* Fog effect */}
      <fog attach="fog" args={['#0a0a1a', 30, 60]} />
    </>
  );
}

export function Game() {
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  return (
    <div className="game-container">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        style={{ background: '#0a0a1a' }}
      >
        <PerspectiveCamera makeDefault position={[0, 15, 12]} fov={50} />
        <Suspense fallback={null}>
          <GameScene />
        </Suspense>
      </Canvas>
      <HUD />
      {isMobile && (
        <TouchControls
          onMove={(x, y) => {}}
          onAttack={() => {}}
          onSpecial={() => {}}
        />
      )}
    </div>
  );
}
