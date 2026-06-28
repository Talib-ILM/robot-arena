// ==========================================
// Gem Model - Collectible Items
// ==========================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Gem } from '../types';

interface GemModelProps {
  gem: Gem;
}

export function GemModel({ gem }: GemModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current && !gem.collected) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = gem.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.15 + 0.5;
    }
  });

  if (gem.collected) return null;

  return (
    <group position={[gem.position.x, 0, gem.position.z]}>
      {/* Gem crystal */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0.5, 0]}
        color="#8b5cf6"
        intensity={2}
        distance={3}
      />
      {/* Base ring */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 8, 16]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#c084fc"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
