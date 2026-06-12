'use client';

import { useEffect, useState } from 'react';

export default function CursorLight() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchGlows, setTouchGlows] = useState([]);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Desktop: cursor follow
    const handleMouseMove = (e) => {
      if (!isMobile) {
        setMousePos({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      if (!isMobile) {
        setIsVisible(false);
      }
    };

    // Mobile: touch impact
    const handleTouchStart = (e) => {
      if (isMobile) {
        const touch = e.touches[0];
        const id = Date.now();
        setTouchGlows(prev => [...prev, { x: touch.clientX, y: touch.clientY, id, opacity: 1 }]);

        // Fade out over 500ms
        let startTime = Date.now();
        const fadeInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / 500;

          if (progress >= 1) {
            setTouchGlows(prev => prev.filter(g => g.id !== id));
            clearInterval(fadeInterval);
          } else {
            setTouchGlows(prev =>
              prev.map(g => (g.id === id ? { ...g, opacity: 1 - progress } : g))
            );
          }
        }, 10);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile]);

  return (
    <>
      {/* Desktop: Cursor glow */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200, 200, 200, 0.25) 0%, rgba(200, 200, 200, 0.1) 40%, rgba(200, 200, 200, 0) 70%)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 1,
            filter: 'blur(30px)',
          }}
        />
      )}

      {/* Mobile: Touch impact glows */}
      {isMobile &&
        touchGlows.map(glow => (
          <div
            key={glow.id}
            style={{
              position: 'fixed',
              left: `${glow.x}px`,
              top: `${glow.y}px`,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 35%, rgba(255, 255, 255, 0) 70%)',
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
              opacity: glow.opacity,
              zIndex: 1,
              filter: 'blur(35px)',
            }}
          />
        ))}
    </>
  );
}

