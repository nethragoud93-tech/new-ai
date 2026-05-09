const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class AnalystAgent {
  constructor({ simulationMode, groqKey } = {}) {
    this.simulationMode = simulationMode;
    this.groqKey = groqKey || process.env.GROQ_API_KEY;
  }

  async run(researchData, onProgress) {
    const { findings, subtasks } = researchData;

    onProgress('Analyzing findings with LLM intelligence...');
    
    const trends = [];
    const risks = [];
    const opportunities = [];
    const insights = [];

    if (!this.simulationMode && this.groqKey) {
      // Chunk findings to avoid prompt bloat, or just send a summary
      const findingsSummary = findings.map((f, i) => `ID:${i} | Source:${f.source} | Content:${f.snippet.substring(0, 200)}`).join('\n---\n');
      
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.groqKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are a Data Analyst. Classify the provided research findings into one of four categories: TREND, RISK, OPPORTUNITY, INSIGHT. Return a JSON object where keys are IDs (e.g., "0", "1") and values are the category string.'
              },
              { role: 'user', content: `Findings:\n${findingsSummary}` }
            ],
            response_format: { type: "json_object" }
          })
        });
        const data = await res.json();
        const classifications = JSON.parse(data.choices[0].message.content);

        findings.forEach((f, i) => {
          const tag = classifications[i.toString()] || 'INSIGHT';
          const item = { ...f, tag: tag.toUpperCase() };
          if (tag === 'TREND') trends.push(item);
          else if (tag === 'RISK') risks.push(item);
          else if (tag === 'OPPORTUNITY') opportunities.push(item);
          else insights.push(item);
        });
      } catch (err) {
        console.error("Analyst classification failed:", err);
        // Fallback
        findings.forEach((f, i) => {
          const tag = this.classify(f, i);
          const item = { ...f, tag: tag.toUpperCase() };
          if (tag === 'trend') trends.push(item);
          else if (tag === 'risk') risks.push(item);
          else if (tag === 'opportunity') opportunities.push(item);
          else insights.push(item);
        });
      }
    } else {
      await sleep(1000);
      findings.forEach((f, i) => {
        const tag = this.classify(f, i);
        const item = { ...f, tag: tag.toUpperCase() };
        if (tag === 'trend') trends.push(item);
        else if (tag === 'risk') risks.push(item);
        else if (tag === 'opportunity') opportunities.push(item);
        else insights.push(item);
      });
    }

    onProgress(`Identified ${trends.length} trends, ${risks.length} risks, ${opportunities.length} opportunities`);
    await sleep(500);

    return { trends, risks, opportunities, insights, subtasks };
  }

  classify(finding, index) {
    const patterns = ['trend', 'insight', 'risk', 'opportunity', 'trend'];
    return patterns[index % patterns.length];
  }
}

