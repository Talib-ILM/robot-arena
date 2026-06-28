// ==========================================
// useTouchControls - Touch Joystick Hook
// ==========================================

import { useRef, useCallback, useState, useEffect } from 'react';

export interface TouchInput {
  moveX: number;
  moveZ: number;
  attack: boolean;
  special: boolean;
}

export function useTouchControls() {
  const [active, setActive] = useState(false);
  const joystickRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const attackRef = useRef(false);
  const specialRef = useRef(false);

  const handleAttackDown = useCallback(() => {
    attackRef.current = true;
  }, []);

  const handleAttackUp = useCallback(() => {
    attackRef.current = false;
  }, []);

  const handleSpecialDown = useCallback(() => {
    specialRef.current = true;
  }, []);

  const handleSpecialUp = useCallback(() => {
    specialRef.current = false;
  }, []);

  return {
    active,
    setActive,
    joystickRef,
    attackRef,
    specialRef,
    handleAttackDown,
    handleAttackUp,
    handleSpecialDown,
    handleSpecialUp,
  };
}
