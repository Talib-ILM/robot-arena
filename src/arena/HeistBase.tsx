// ==========================================
// HeistBase Model
// ==========================================

import React from 'react';
import { HeistBase } from '../types';

interface HeistBaseModelProps {
  base: HeistBase;
}

export function HeistBaseModel({ base }: HeistBaseModelProps) {
  const healthPercent = base.health / base.maxHealth;
  const color = base.team === 'player' ? '#3b82f6' : '#ef4444';

  return (
    <group position={[base.position.x, 0, base.position.z]}>
      {/* Safe body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[2, 1.2, 2]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Safe door */}
      <mesh position={[0, 0.6, 1.01]}>
        <boxGeometry args={[1.4, 1.0, 0.05]} />
        <meshStandardMaterial
          color="#1f2937"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Lock */}
      <mesh position={[0, 0.6, 1.04]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} />
      </mesh>
      {/* Health bar */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[2.2, 0.2, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[(healthPercent - 1) * 1.05, 0, 0.01]}>
          <boxGeometry args={[healthPercent * 2.1, 0.15, 0.1]} />
          <meshStandardMaterial
            color={healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#ef4444'}
          />
        </mesh>
      </group>
      {/* Glow */}
      <pointLight
        position={[0, 1, 0]}
        color={color}
        intensity={3}
        distance={5}
      />
    </group>
  );
}
