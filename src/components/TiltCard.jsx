import React, { useRef, useState, useCallback } from 'react';

export default function TiltCard({
  children,
  className = '',
  maxTilt = 12,
  isFlipped = false,
  onFlip,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, isHovered: false });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // When flipped 180deg around Y, invert the Y-axis tilt calculation for cursor alignment
    const adjustedX = isFlipped ? -x : x;

    setTilt({
      rx: -y * maxTilt,
      ry: adjustedX * maxTilt,
      isHovered: true,
    });
  }, [maxTilt, isFlipped]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, isHovered: false });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card-container ${className} ${tilt.isHovered ? 'hovered' : ''} ${
        isFlipped ? 'is-card-flipped' : ''
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--rx': `${tilt.rx}deg`,
        '--ry': `${tilt.ry}deg`,
        '--flip-angle': isFlipped ? '180deg' : '0deg',
      }}
    >
      {typeof children === 'function' ? children({ ...tilt, isFlipped, onFlip }) : children}
    </div>
  );
}
