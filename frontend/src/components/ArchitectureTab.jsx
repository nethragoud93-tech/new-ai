const TOOLS = [
  { icon: '🤖', name: 'Claude claude-sonnet-4-5', desc: 'Powers the Writer agent for synthesizing research into structured executive briefings via live API calls.', badge: 'now' },
  { icon: '🔍', name: 'Tavily Search API', desc: 'Real-time web search for the Researcher agent. Toggle SIMULATION_MODE=false in .env to activate.', badge: 'next' },
  { icon: '🔗', name: 'LangGraph / CrewAI', desc: 'Production orchestration layer to replace the custom agent loop with managed, stateful graphs.', badge: 'next' },
  { icon: '📬', name: 'Gmail / Slack MCP', desc: 'Auto-deliver briefings to email or Slack channels after each completed research mission.', badge: 'next' },
  { icon: '⏰', name: 'n8n Scheduler', desc: 'Trigger research runs on a cron schedule — e.g., every Monday 8AM, auto-researching your key topics.', badge: 'next' },
  { icon: '🧠', name: 'Vector Memory', desc: 'Store past briefings in Pinecone / pgvector for cross-run reasoning and trend tracking over time.', badge: 'next' },
];

const PIPE = [
  { icon: '👤', l: 'User', s: 'Topic Input' },
  { icon: '🧠', l: 'Manager', s: 'Orchestrate & Validate' },
  { icon: '🔍', l: 'Researcher', s: 'Search + Confidence Score' },
  { icon: '📊', l: 'Analyst', s: 'Tag & Classify' },
  { icon: '✍️', l: 'Writer', s: 'Claude API' },
  { icon: '🔬', l: 'Critic', s: 'QA + Retry Loop' },
  { icon: '📄', l: 'Briefing', s: 'Delivered' },
];

const LOOP = [
  { icon: '🔬', l: 'Critic', s: 'QA Fails' },
  { icon: '🧠', l: 'Manager', s: 'Re-dispatches' },
  { icon: '✍️', l: 'Writer', s: 'Revises' },
  { icon: '🔬', l: 'Critic', s: 'Re-reviews' },
  { icon: '✅', l: 'Pass', s: 'Delivered' },
];

function Flow({ nodes }) {
  return (
    <div className="arch-flow">
      {nodes.map((n, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div className="arch-node">
            <span className="i">{n.icon}</span>
            <span className="l">{n.l}</span>
            <span className="s">{n.s}</span>
          </div>
          {i < nodes.length - 1 && <span className="arch-sep">→</span>}
        </div>
      ))}
    </div>
  );
}

export default function ArchitectureTab() {
  return (
    <div className="arch-wrap">
      <div className="arch-card">
        <h3>🔄 Full Agent Pipeline Flow</h3>
        <Flow nodes={PIPE} />
      </div>
      <div className="arch-card">
        <h3>🔁 Self-Correction Loop (triggered on QA failure)</h3>
        <Flow nodes={LOOP} />
      </div>
      <div className="arch-card">
        <h3>🛠️ Tool Integrations</h3>
        <div className="tools-grid">
          {TOOLS.map(t => (
            <div key={t.name} className="tool-card">
              <span className="ti">{t.icon}</span>
              <div>
                <h4>{t.name}</h4>
                <p>{t.desc}</p>
                <span className={`tool-pill ${t.badge}`}>{t.badge === 'now' ? '✓ Integrated' : '→ Roadmap'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
