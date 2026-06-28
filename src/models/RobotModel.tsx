// ==========================================
// Robot Models - Procedural Three.js Geometry
// ==========================================

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { RobotId, Player } from '../types';
import { ROBOTS } from '../data/robots';

interface RobotModelProps {
  robotId: RobotId;
  player: Player;
  isPlayer?: boolean;
}

// Shared materials cache
const materialsCache = new Map<string, THREE.Material>();

function getMaterial(color: string, emissive?: string): THREE.MeshStandardMaterial {
  const key = `${color}-${emissive || ''}`;
  if (!materialsCache.has(key)) {
    materialsCache.set(key, new THREE.MeshStandardMaterial({
      color,
      emissive: emissive || '#000000',
      emissiveIntensity: emissive ? 0.3 : 0,
      metalness: 0.6,
      roughness: 0.3,
    }));
  }
  return materialsCache.get(key)! as THREE.MeshStandardMaterial;
}

// Bolt - Fast agile scout robot
function BoltModel({ color, accentColor, isPlayer }: { color: string; accentColor: string; isPlayer: boolean }) {
  const mainMat = useMemo(() => getMaterial(color), [color]);
  const accentMat = useMemo(() => getMaterial(accentColor, accentColor), [accentColor]);
  const eyeMat = useMemo(() => getMaterial('#ffffff', '#ffffff'), []);

  return (
    <group>
      {/* Body - streamlined */}
      <mesh position={[0, 0.8, 0]} material={mainMat}>
        <boxGeometry args={[0.8, 1.0, 0.6]} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.5, 0]} material={mainMat}>
        <boxGeometry args={[0.6, 0.5, 0.5]} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 1.55, 0.26]} material={eyeMat}>
        <sphereGeometry args={[0.08, 8, 8]} />
      </mesh>
      <mesh position={[0.15, 1.55, 0.26]} material={eyeMat}>
        <sphereGeometry args={[0.08, 8, 8]} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 1.9, 0]} material={accentMat}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
      </mesh>
      {/* Left arm - blaster */}
      <mesh position={[-0.6, 0.9, 0.1]} material={accentMat}>
        <boxGeometry args={[0.3, 0.3, 0.5]} />
      </mesh>
      {/* Right arm - blaster */}
      <mesh position={[0.6, 0.9, 0.1]} material={accentMat}>
        <boxGeometry args={[0.3, 0.3, 0.5]} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0.2, 0]} material={mainMat}>
        <boxGeometry args={[0.25, 0.4, 0.3]} />
      </mesh>
      <mesh position={[0.2, 0.2, 0]} material={mainMat}>
        <boxGeometry args={[0.25, 0.4, 0.3]} />
      </mesh>
      {/* Speed stripes */}
      <mesh position={[0, 0.8, 0.31]} material={accentMat}>
        <boxGeometry args={[0.6, 0.1, 0.02]} />
      </mesh>
      <mesh position={[0, 1.0, 0.31]} material={accentMat}>
        <boxGeometry args={[0.4, 0.1, 0.02]} />
      </mesh>
    </group>
  );
}

// Tank - Heavy assault robot
function TankModel({ color, accentColor }: { color: string; accentColor: string }) {
  const mainMat = useMemo(() => getMaterial(color), [color]);
  const accentMat = useMemo(() => getMaterial(accentColor, accentColor), [accentColor]);
  const eyeMat = useMemo(() => getMaterial('#ff4444', '#ff4444'), []);

  return (
    <group>
      {/* Body - wide and heavy */}
      <mesh position={[0, 0.9, 0]} material={mainMat}>
        <boxGeometry args={[1.2, 1.0, 0.9]} />
      </mesh>
      {/* Head - small visor */}
      <mesh position={[0, 1.6, 0.1]} material={mainMat}>
        <boxGeometry args={[0.8, 0.4, 0.6]} />
      </mesh>
      {/* Eye visor */}
      <mesh position={[0, 1.6, 0.36]} material={eyeMat}>
        <boxGeometry args={[0.6, 0.15, 0.05]} />
      </mesh>
      {/* Left arm - heavy cannon */}
      <mesh position={[-0.8, 1.0, 0.2]} material={accentMat}>
        <boxGeometry args={[0.4, 0.4, 0.7]} />
      </mesh>
      <mesh position={[-0.8, 1.0, 0.6]} material={accentMat}>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
      </mesh>
      {/* Right arm - shield */}
      <mesh position={[0.8, 1.0, 0]} material={accentMat}>
        <boxGeometry args={[0.3, 0.8, 0.6]} />
      </mesh>
      {/* Shoulder armor */}
      <mesh position={[-0.7, 1.4, 0]} material={accentMat}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
      </mesh>
      <mesh position={[0.7, 1.4, 0]} material={accentMat}>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
      </mesh>
      {/* Legs - thick */}
      <mesh position={[-0.35, 0.25, 0]} material={mainMat}>
        <boxGeometry args={[0.35, 0.5, 0.4]} />
      </mesh>
      <mesh position={[0.35, 0.25, 0]} material={mainMat}>
        <boxGeometry args={[0.35, 0.5, 0.4]} />
      </mesh>
      {/* Armor plates */}
      <mesh position={[0, 0.9, 0.46]} material={accentMat}>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
      </mesh>
    </group>
  );
}

// Spark - Tech specialist
function SparkModel({ color, accentColor }: { color: string; accentColor: string }) {
  const mainMat = useMemo(() => getMaterial(color), [color]);
  const accentMat = useMemo(() => getMaterial(accentColor, accentColor), [accentColor]);
  const eyeMat = useMemo(() => getMaterial('#ffff00', '#ffff00'), []);
  const electricMat = useMemo(() => getMaterial('#00ffff', '#00ffff'), []);

  return (
    <group>
      {/* Body - tech-focused */}
      <mesh position={[0, 0.85, 0]} material={mainMat}>
        <boxGeometry args={[0.9, 0.9, 0.7]} />
      </mesh>
      {/* Head - data visor */}
      <mesh position={[0, 1.5, 0]} material={mainMat}>
        <boxGeometry args={[0.5, 0.5, 0.6]} />
      </mesh>
      {/* Eye arrays */}
      <mesh position={[-0.1, 1.55, 0.31]} material={eyeMat}>
        <sphereGeometry args={[0.06, 6, 6]} />
      </mesh>
      <mesh position={[0.1, 1.55, 0.31]} material={eyeMat}>
        <sphereGeometry args={[0.06, 6, 6]} />
      </mesh>
      <mesh position={[0, 1.45, 0.31]} material={eyeMat}>
        <sphereGeometry args={[0.06, 6, 6]} />
      </mesh>
      {/* Tesla coils on shoulders */}
      <mesh position={[-0.6, 1.2, 0]} material={electricMat}>
        <coneGeometry args={[0.1, 0.4, 6]} />
      </mesh>
      <mesh position={[0.6, 1.2, 0]} material={electricMat}>
        <coneGeometry args={[0.1, 0.4, 6]} />
      </mesh>
      {/* Arms - energy projectors */}
      <mesh position={[-0.6, 0.85, 0.2]} material={accentMat}>
        <boxGeometry args={[0.25, 0.4, 0.5]} />
      </mesh>
      <mesh position={[0.6, 0.85, 0.2]} material={accentMat}>
        <boxGeometry args={[0.25, 0.4, 0.5]} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.25, 0.2, 0]} material={mainMat}>
        <boxGeometry args={[0.2, 0.35, 0.3]} />
      </mesh>
      <mesh position={[0.25, 0.2, 0]} material={mainMat}>
        <boxGeometry args={[0.2, 0.35, 0.3]} />
      </mesh>
      {/* Tech panels on body */}
      <mesh position={[0, 0.85, 0.36]} material={electricMat}>
        <boxGeometry args={[0.5, 0.5, 0.02]} />
      </mesh>
      {/* Circuit lines */}
      <mesh position={[0, 0.7, 0.37]} material={accentMat}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
      </mesh>
      <mesh position={[0, 1.0, 0.37]} material={accentMat}>
        <boxGeometry args={[0.3, 0.02, 0.02]} />
      </mesh>
    </group>
  );
}

// Hex - Mysterious drone robot
function HexModel({ color, accentColor }: { color: string; accentColor: string }) {
  const mainMat = useMemo(() => getMaterial(color), [color]);
  const accentMat = useMemo(() => getMaterial(accentColor, accentColor), [accentColor]);
  const eyeMat = useMemo(() => getMaterial('#ff00ff', '#ff00ff'), []);
  const droneMat = useMemo(() => getMaterial(color, color), [color]);

  return (
    <group>
      {/* Body - sleek floating design */}
      <mesh position={[0, 1.0, 0]} material={mainMat}>
        <octahedronGeometry args={[0.4, 0]} />
      </mesh>
      {/* Head - floating orb */}
      <mesh position={[0, 1.6, 0]} material={mainMat}>
        <sphereGeometry args={[0.3, 8, 8]} />
      </mesh>
      {/* Single eye */}
      <mesh position={[0, 1.6, 0.2]} material={eyeMat}>
        <sphereGeometry args={[0.12, 8, 8]} />
      </mesh>
      {/* Floating drone wings */}
      <mesh position={[-0.7, 1.2, 0]} material={droneMat}>
        <boxGeometry args={[0.6, 0.08, 0.3]} />
      </mesh>
      <mesh position={[0.7, 1.2, 0]} material={droneMat}>
        <boxGeometry args={[0.6, 0.08, 0.3]} />
      </mesh>
      {/* Hover jets */}
      <mesh position={[-0.3, 0.5, 0]} material={accentMat}>
        <cylinderGeometry args={[0.1, 0.15, 0.2, 6]} />
      </mesh>
      <mesh position={[0.3, 0.5, 0]} material={accentMat}>
        <cylinderGeometry args={[0.1, 0.15, 0.2, 6]} />
      </mesh>
      {/* Energy tendrils */}
      <mesh position={[-0.2, 0.7, -0.3]} material={accentMat}>
        <boxGeometry args={[0.04, 0.4, 0.04]} />
      </mesh>
      <mesh position={[0.2, 0.7, -0.3]} material={accentMat}>
        <boxGeometry args={[0.04, 0.4, 0.04]} />
      </mesh>
      {/* Glowing core */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.0}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export function RobotModel({ robotId, player, isPlayer = false }: RobotModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const robot = ROBOTS[robotId];

  // Animation bob
  const bobRef = useRef(0);

  const modelComponent = useMemo(() => {
    switch (robotId) {
      case 'bolt':
        return <BoltModel color={robot.color} accentColor={robot.accentColor} isPlayer={isPlayer} />;
      case 'tank':
        return <TankModel color={robot.color} accentColor={robot.accentColor} />;
      case 'spark':
        return <SparkModel color={robot.color} accentColor={robot.accentColor} />;
      case 'hex':
        return <HexModel color={robot.color} accentColor={robot.accentColor} />;
      default:
        return null;
    }
  }, [robotId, robot.color, robot.accentColor, isPlayer]);

  return (
    <group
      ref={groupRef}
      position={[player.position.x, player.position.y, player.position.z]}
      rotation={[0, player.rotation, 0]}
    >
      {/* Health bar */}
      {player.health < player.maxHealth && (
        <group position={[0, 2.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.0, 0.1, 0.05]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[(player.health / player.maxHealth - 1) * 0.5, 0, 0.01]}>
            <boxGeometry args={[player.health / player.maxHealth, 0.08, 0.05]} />
            <meshStandardMaterial
              color={player.health / player.maxHealth > 0.5 ? '#22c55e' : '#ef4444'}
            />
          </mesh>
        </group>
      )}
      {/* Robot model */}
      {modelComponent}
    </group>
  );
}
