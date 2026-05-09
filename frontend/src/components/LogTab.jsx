import { useEffect, useRef, useState } from 'react';

const ALL_AGENTS = ['All', 'Manager', 'Researcher', 'Analyst', 'Writer', 'Critic'];

function fmt(ts) {
  return new Date(ts).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LogTab({ logs }) {
  const bottomRef = useRef(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const filtered = filter === 'All' ? logs : logs.filter(l => l.agent === filter);

  return (
    <div className="log-wrap">
      <div className="log-toolbar">
        {ALL_AGENTS.map(a => (
          <button key={a} className={`log-filter ${filter === a ? 'active' : ''}`} onClick={() => setFilter(a)}>
            {a} {a !== 'All' && logs.filter(l => l.agent === a).length > 0 ? `(${logs.filter(l => l.agent === a).length})` : ''}
          </button>
        ))}
      </div>
      <div className="log-entries">
        {filtered.length === 0 ? (
          <div className="log-empty">
            {logs.length === 0 ? '📋 Agent log is empty. Deploy a crew to see real-time activity.' : `No entries for ${filter}.`}
          </div>
        ) : (
          filtered.map(log => (
            <div key={log.id} className="log-entry">
              <span className="log-time">{fmt(log.timestamp)}</span>
              <span className={`log-agent-tag ${log.agent}`}>{log.agent}</span>
              <span className="log-msg">
                {log.status && (
                  <span className={`log-badge ${log.status === 'warning' ? 'warning' : log.status === 'success' ? 'success' : 'running'}`}>
                    {log.status.toUpperCase()}
                  </span>
                )}
                <strong style={{ color: '#e2e8f0', marginRight: 6 }}>{log.action}</strong>
                {log.detail}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
