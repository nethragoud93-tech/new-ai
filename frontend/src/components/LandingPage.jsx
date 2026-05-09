import RobotVideoBackground from './RobotVideoBackground.jsx';

export default function LandingPage({ onEnter }) {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <RobotVideoBackground />
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
          AI Research Crew
        </h1>
        <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
          An autonomous team of AI agents that coordinates to research, analyze, and synthesize deep intelligence briefings in real-time.
        </p>
        
        <button 
          onClick={onEnter}
          style={{
            padding: '16px 36px',
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
            background: '#4f46e5',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.6)';
            e.currentTarget.style.background = '#4338ca';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
            e.currentTarget.style.background = '#4f46e5';
          }}
        >
          Know More
        </button>
      </div>
    </div>
  );
}
