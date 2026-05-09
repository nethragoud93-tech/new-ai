export default function Header({ status, running }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <div className="logo-text">
              <h1>AI Research Crew</h1>
              <p>Multi-Agent Agentic System · Hackathon Demo</p>
            </div>
          </div>
          <div className="header-right">
            <span className="header-badge">5-Agent Pipeline</span>
            <div className="status-pill">
              <div className={`dot ${status !== 'online' ? 'off' : ''}`} />
              <span className="status-txt">
                {running ? 'Mission Active' : status === 'online' ? 'Systems Online' : status === 'checking' ? 'Connecting...' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
