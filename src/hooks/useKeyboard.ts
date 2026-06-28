// ==========================================
// useKeyboard - Keyboard Input Hook
// ==========================================

import { useEffect, useRef, useCallback } from 'react';

export interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  attack: boolean;
  special: boolean;
  pause: boolean;
}

export function useKeyboard() {
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    attack: false,
    special: false,
    pause: false,
  });

  const attackPressed = useRef(false);
  const specialPressed = useRef(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.current.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.current.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.current.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.current.right = true;
        break;
      case 'Space':
        if (!attackPressed.current) {
          keys.current.attack = true;
          attackPressed.current = true;
        }
        break;
      case 'KeyE':
      case 'ShiftLeft':
        if (!specialPressed.current) {
          keys.current.special = true;
          specialPressed.current = true;
        }
        break;
      case 'Escape':
      case 'KeyP':
        keys.current.pause = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        keys.current.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        keys.current.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        keys.current.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        keys.current.right = false;
        break;
      case 'Space':
        keys.current.attack = false;
        attackPressed.current = false;
        break;
      case 'KeyE':
      case 'ShiftLeft':
        keys.current.special = false;
        specialPressed.current = false;
        break;
      case 'Escape':
      case 'KeyP':
        keys.current.pause = false;
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
}
