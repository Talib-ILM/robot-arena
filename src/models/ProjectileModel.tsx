// ==========================================
// Projectile Model
// ==========================================

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Projectile } from '../types';

interface ProjectileModelProps {
  projectile: Projectile;
}

const COLORS: Record<string, string> = {
  bullet: '#ff6b35',
  beam: '#00ffff',
  rocket: '#ff4444',
  orb: '#c084fc',
};

export function ProjectileModel({ projectile }: ProjectileModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = COLORS[projectile.type] || '#ffffff';

  return (
    <mesh
      ref={meshRef}
      position={[projectile.position.x, projectile.position.y, projectile.position.z]}
    >
      {projectile.type === 'bullet' ? (
        <sphereGeometry args={[0.15, 6, 6]} />
      ) : projectile.type === 'beam' ? (
        <cylinderGeometry args={[0.05, 0.05, 0.5, 4]} />
      ) : (
        <octahedronGeometry args={[0.2, 0]} />
      )}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
      />
    </mesh>
  );
}
