// ==========================================
// TouchControls - On-screen controls for mobile
// ==========================================

import React, { useRef, useCallback, useEffect, useState } from 'react';

interface TouchControlsProps {
  onMove: (x: number, y: number) => void;
  onAttack: (active: boolean) => void;
  onSpecial: (active: boolean) => void;
}

export function TouchControls({ onMove, onAttack, onSpecial }: TouchControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [joystickActive, setJoystickActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setJoystickActive(true);
  }, []);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current && joystickRef.current) {
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let dx = (touch.clientX - centerX) / (rect.width / 2);
        let dy = (touch.clientY - centerY) / (rect.height / 2);
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 1) {
          dx /= len;
          dy /= len;
        }
        setJoystickPos({ x: dx * 30, y: dy * 30 });
        onMove(dx, dy);
      }
    }
  }, [onMove]);

  const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickActive(false);
        setJoystickPos({ x: 0, y: 0 });
        onMove(0, 0);
      }
    }
  }, [onMove]);

  return (
    <div className="touch-controls">
      {/* Joystick */}
      <div
        ref={joystickRef}
        className={`joystick-container ${joystickActive ? 'active' : ''}`}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
      >
        <div className="joystick-base" />
        <div
          className="joystick-thumb"
          style={{
            transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button
          className="action-btn attack-btn"
          onTouchStart={() => onAttack(true)}
          onTouchEnd={() => onAttack(false)}
        >
          <span>⚔️</span>
        </button>
        <button
          className="action-btn special-btn"
          onTouchStart={() => onSpecial(true)}
          onTouchEnd={() => onSpecial(false)}
        >
          <span>⚡</span>
        </button>
      </div>
    </div>
  );
}
