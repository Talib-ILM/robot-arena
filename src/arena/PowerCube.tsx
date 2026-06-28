// ==========================================
// Power Cube - Showdown pickup
// ==========================================

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PowerCubeProps {
  position: { x: number; z: number };
  collected: boolean;
}

export function PowerCube({ position, collected }: PowerCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (collected) return null;

  return (
    <group position={[position.x, 0, position.z]}>
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <pointLight
        position={[0, 0.5, 0]}
        color="#22c55e"
        intensity={2}
        distance={3}
      />
    </group>
  );
}
