const SUGGESTIONS = ['Generative AI in Healthcare', 'Quantum Computing 2025', 'Climate Tech Investment', 'Autonomous Vehicles', 'Web3 & DeFi Trends'];

export default function ControlPanel({ topic, setTopic, running, onDeploy, elapsed, retries, totalLogs, done }) {
  return (
    <div className="control-panel">
      <div className="cp-top">
        <div>
          <h2>Deploy Research Crew</h2>
          <p>Enter a research topic. 5 specialized AI agents will autonomously research, analyze, write & self-correct in real time.</p>
        </div>
        <div className="cp-stats">
          <div className="stat-box">
            <div className="val">{elapsed > 0 ? `${elapsed}s` : '—'}</div>
            <div className="lbl">Elapsed</div>
          </div>
          <div className="stat-box">
            <div className="val">{retries}</div>
            <div className="lbl">Retries</div>
          </div>
          <div className="stat-box">
            <div className="val">{totalLogs}</div>
            <div className="lbl">Events</div>
          </div>
          <div className="stat-box">
            <div className="val">{done}/5</div>
            <div className="lbl">Agents Done</div>
          </div>
        </div>
      </div>
      <div className="input-row">
        <input
          id="research-topic-input"
          className="topic-input"
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onDeploy()}
          placeholder="e.g. Generative AI in Healthcare..."
          disabled={running}
        />
        <button id="deploy-crew-btn" className="deploy-btn" onClick={onDeploy} disabled={running || !topic.trim()}>
          {running ? <><div className="spinner" /> Crew Running...</> : <>Deploy Crew</>}
        </button>
      </div>
      <div className="chips">
        {SUGGESTIONS.map(s => (
          <button key={s} className="chip" onClick={() => setTopic(s)} disabled={running}>{s}</button>
        ))}
      </div>
    </div>
  );
}
