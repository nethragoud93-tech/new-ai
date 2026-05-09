import { useEffect, useRef } from 'react';

export default function RobotBackground() {
  const bgRef = useRef(null);

  useEffect(() => {
    let animId;
    let pos = 0;
    
    const animate = () => {
      pos += 0.05; // Slow pan
      if (bgRef.current) {
        // Create a subtle breathing/flowing effect
        const scale = 1.05 + Math.sin(pos * 0.02) * 0.05;
        const xOffset = Math.sin(pos * 0.01) * 2;
        const yOffset = Math.cos(pos * 0.015) * 2;
        
        bgRef.current.style.transform = `scale(${scale}) translate(${xOffset}%, ${yOffset}%)`;
      }
      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {/* The stunning robot background image */}
      <div 
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: '-10%', // Bleed edge for panning
          width: '120%',
          height: '120%',
          backgroundImage: 'url(/robot-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.1s linear',
          opacity: 0.8, // Slightly dimmed to allow dashboard UI to stand out
        }}
      />
      {/* Dark overlay to ensure the dashboard remains highly readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.9) 100%)',
      }} />
    </div>
  );
}
