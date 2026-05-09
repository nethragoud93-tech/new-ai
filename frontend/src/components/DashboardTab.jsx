export default function DashboardTab({ topic, setTopic, running, onDeploy, activeAgent, doneAgents, logs }) {
  const isAgentActive = (id) => activeAgent === id;
  const isAgentDone = (id) => doneAgents.includes(id);

  const getBorderColor = (id, defaultColor) => {
    if (isAgentActive(id)) return '#4f46e5'; // active purple
    if (isAgentDone(id)) return '#10b981'; // done green
    return defaultColor;
  };

  const lastLog = logs.length > 0 ? `${logs[logs.length - 1].agent} [${logs[logs.length - 1].action}]: ${logs[logs.length - 1].detail}` : 'Waiting for task...';

  return (
    <div className="orchestration-view">
      <h1 className="orch-title">Manager Agent orchestration</h1>
      
      <div className="orch-container">
        
        {/* Visual Diagram */}
        <div className="orch-diagram">
          <div 
            className={`orch-node manager-node ${isAgentActive('manager') ? 'pulse' : ''}`}
            style={{ borderColor: getBorderColor('manager', '#8b5cf6') }}
          >
            Manager
          </div>
          
          <div className="orch-arrow">↓</div>
          
          <div className="orch-row">
            <div 
              className={`orch-node ${isAgentActive('researcher') ? 'pulse' : ''}`}
              style={{ borderColor: getBorderColor('researcher', '#06b6d4') }}
            >
              Researcher (Web Search)
            </div>
            <div 
              className={`orch-node ${isAgentActive('analyst') ? 'pulse' : ''}`}
              style={{ borderColor: getBorderColor('analyst', '#f59e0b') }}
            >
              Analyst
            </div>
            <div 
              className={`orch-node ${isAgentActive('writer') ? 'pulse' : ''}`}
              style={{ borderColor: getBorderColor('writer', '#10b981') }}
            >
              Writer
            </div>
          </div>
        </div>

        {/* Input and Action */}
        <div className="orch-actions">
          <input 
            type="text" 
            className="orch-input" 
            placeholder="Enter a topic for the AI Research Crew (e.g., Quantum Computing)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={running}
            onKeyDown={(e) => e.key === 'Enter' && onDeploy()}
          />
          <button 
            className="orch-btn" 
            onClick={onDeploy} 
            disabled={running || !topic.trim()}
          >
            {running ? 'Crew Running...' : 'Run Real Agent Orchestration'}
          </button>
        </div>

        {/* Status Box */}
        <div className="orch-status">
          {lastLog}
        </div>
        
      </div>
    </div>
  );
}
