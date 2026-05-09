import { useEffect, useRef } from 'react';

export default function RobotVideoBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;
    
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system for "live" feel
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        s: Math.random() * 2 + 1,
        v: Math.random() * 0.5 + 0.2,
        a: Math.random() * 0.5 + 0.2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      
      // Scanning line effect
      const scanY = (Date.now() / 40) % H;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)';
      ctx.lineWidth = 2;
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.stroke();

      // Floating data particles
      particles.forEach(p => {
        p.y -= p.v;
        if (p.y < -10) p.y = H + 10;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.a})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      background: '#0a0f1e' // Slightly deeper dark for cinematic feel
    }}>
      {/* Cinematic Background Video matching the Canva template aesthetic */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.7, // Balances the visual impact with dashboard readability
        }}
      >
        <source src="https://videos.pexels.com/video-files/17827958/17827958-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>
      
      {/* Holographic scanning overlay */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3
        }}
      />

      {/* Cinematic vignetting and gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(10,15,30,0.1) 0%, rgba(10,15,30,0.7) 100%)',
      }} />
    </div>
  );
}
