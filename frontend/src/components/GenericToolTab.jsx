import { useState } from 'react';

export default function GenericToolTab({ toolId, title, description, placeholder, buttonText }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: toolId, input }),
      });
      const data = await res.json();
      if (data.error) {
        setOutput('Error: ' + data.error);
      } else {
        setOutput(data.result);
      }
    } catch (err) {
      setOutput('Failed to connect to the AI system.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orchestration-view">
      <h1 className="orch-title">{title}</h1>
      
      <div className="orch-container" style={{ alignItems: 'flex-start' }}>
        <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '15px' }}>{description}</p>
        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <textarea 
            className="orch-input" 
            style={{ minHeight: '180px', fontFamily: toolId === 'debugger' ? 'var(--mono)' : 'var(--font)', resize: 'vertical' }}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          
          <button 
            className="orch-btn" 
            onClick={handleSubmit} 
            disabled={loading || !input.trim()}
            style={{ width: 'auto', alignSelf: 'flex-start', padding: '12px 32px' }}
          >
            {loading ? 'Processing...' : buttonText}
          </button>
        </div>

        {output && (
          <div style={{ width: '100%', marginTop: '32px' }}>
            <h3 style={{ color: '#f8fafc', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Response</h3>
            <div className="orch-status" style={{ textAlign: 'left', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontFamily: "'Roboto', sans-serif" }}>
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
