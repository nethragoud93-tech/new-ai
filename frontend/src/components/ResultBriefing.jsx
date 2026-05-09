import { useState } from 'react';

export default function ResultBriefing({ briefing, topic }) {
  const [copied, setCopied] = useState(false);

  if (!briefing) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <h3>No Briefing Yet</h3>
        <p>Deploy the crew on a research topic. The Writer agent will generate a full executive briefing here automatically.</p>
      </div>
    );
  }

  const copyText = () => {
    const text = [
      briefing.title,
      '',
      'EXECUTIVE SUMMARY',
      briefing.executiveSummary,
      '',
      ...briefing.sections.map(s => `${s.heading}\n${s.content}`),
      '',
      'NEXT STEPS',
      ...briefing.nextSteps.map((s, i) => `${i + 1}. ${s}`),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="briefing-wrap">
      <div className="briefing-head">
        <div className="briefing-head-top">
          <h2>{briefing.title}</h2>
          <button className="copy-btn" onClick={copyText}>
            {copied ? '✓ Copied!' : '📋 Copy Briefing'}
          </button>
        </div>
        <div className="briefing-meta">
          <span className="meta-item">🕐 {new Date(briefing.generatedAt).toLocaleString()}</span>
          <span className="meta-item">📊 {briefing.metadata?.dataPoints} data points</span>
          <span className="meta-item">⭐ {briefing.metadata?.avgReliability} avg reliability</span>
          <span className="meta-item">🤖 {briefing.metadata?.generatedBy}</span>
        </div>
      </div>

      <div className="briefing-body">
        <div className="summary-box">
          <h3>Executive Summary</h3>
          <p>{briefing.executiveSummary}</p>
        </div>

        {briefing.sections?.map((sec, i) => (
          <div key={i} className="briefing-section">
            <span className={`section-tag ${sec.tag}`}>{sec.tag}</span>
            <div className="section-heading">{sec.heading}</div>
            <div className="section-content">{sec.content}</div>
          </div>
        ))}

        {briefing.nextSteps?.length > 0 && (
          <div className="nextsteps-box">
            <h3>🎯 Recommended Next Steps</h3>
            <div className="steps-list">
              {briefing.nextSteps.map((step, i) => (
                <div key={i} className="step-item">
                  <span className="step-n">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
