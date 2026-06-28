// ==========================================
// Arena - 3D Game Arena
// ==========================================

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MAP_CONFIGS } from '../data/gameModes';

interface ArenaProps {
  mapSize: string;
}

export function Arena({ mapSize }: ArenaProps) {
  const config = MAP_CONFIGS[mapSize] || MAP_CONFIGS.medium;

  const wallColor = '#374151';
  const groundColor = '#1a1a2e';
  const obstacleColor = '#4a5568';

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[config.size * 2, config.size * 2]} />
        <meshStandardMaterial color={groundColor} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[config.size * 2, 40, '#2d2d44', '#2d2d44']} position={[0, 0.01, 0]} />

      {/* Arena walls */}
      {/* North wall */}
      <mesh position={[0, 1, -config.size]} receiveShadow>
        <boxGeometry args={[config.size * 2, 2, 0.5]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* South wall */}
      <mesh position={[0, 1, config.size]} receiveShadow>
        <boxGeometry args={[config.size * 2, 2, 0.5]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* East wall */}
      <mesh position={[config.size, 1, 0]} receiveShadow>
        <boxGeometry args={[0.5, 2, config.size * 2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* West wall */}
      <mesh position={[-config.size, 1, 0]} receiveShadow>
        <boxGeometry args={[0.5, 2, config.size * 2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Obstacles */}
      {config.obstaclePositions.map((obs, i) => (
        <group key={`obs-${i}`}>
          <mesh
            position={[obs.x, 0.5, obs.z]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[obs.width, 1, obs.depth]} />
            <meshStandardMaterial color={obstacleColor} />
          </mesh>
          {/* Top accent */}
          <mesh position={[obs.x, 1.01, obs.z]}>
            <boxGeometry args={[obs.width + 0.1, 0.02, obs.depth + 0.1]} />
            <meshStandardMaterial color="#5a6577" />
          </mesh>
        </group>
      ))}

      {/* Center marker */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#4f46e5"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
