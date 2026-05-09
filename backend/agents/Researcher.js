const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SIMULATED_FINDINGS = {
  generic: [
    { source: 'MIT Technology Review', snippet: 'Rapid acceleration in adoption curves observed across multiple industry verticals.', reliability: 0.92 },
    { source: 'Nature Scientific Reports', snippet: 'Peer-reviewed studies confirm significant efficiency improvements over baseline.', reliability: 0.95 },
    { source: 'Gartner Research 2025', snippet: 'Market size projected to reach $340B by 2027, with 34% CAGR.', reliability: 0.88 },
    { source: 'World Economic Forum', snippet: 'Identified as a top-10 transformative technology for the next decade.', reliability: 0.90 },
    { source: 'Stanford HAI Report', snippet: 'Early adopters reporting 3-5x ROI improvements within 18 months.', reliability: 0.87 },
  ],
};

export class ResearcherAgent {
  constructor({ simulationMode, tavilyKey }) {
    this.simulationMode = simulationMode;
    this.tavilyKey = tavilyKey || process.env.TAVILY_API_KEY;
  }

  generateExtendedFindings(topic) {
    return [
      { source: 'Bloomberg Intelligence', snippet: `Extended analysis of ${topic} reveals deeper regulatory dynamics shaping market.`, reliability: 0.85 },
      { source: 'McKinsey Global Institute', snippet: `Strategic frameworks for ${topic} implementation show 2x value creation.`, reliability: 0.91 },
    ];
  }

  async run(topic, subtasks, onProgress) {
    const findings = [];
    const confidence_factors = [];

    if (!this.simulationMode && this.tavilyKey) {
      for (const task of subtasks) {
        onProgress(`Searching: "${task.substring(0, 50)}..."`);
        try {
          const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: this.tavilyKey,
              query: task,
              search_depth: "basic",
              max_results: 3
            })
          });
          const data = await res.json();
          if (data.results) {
            data.results.forEach(r => {
              findings.push({
                source: r.title || new URL(r.url).hostname,
                snippet: r.content,
                url: r.url,
                reliability: r.score || 0.85
              });
              confidence_factors.push(r.score || 0.85);
            });
          }
        } catch (err) {
          console.error("Tavily search failed for task:", task, err);
        }
        await sleep(200);
      }
    } else {
      // Simulation Mode
      for (let i = 0; i < subtasks.length; i++) {
        const task = subtasks[i];
        onProgress(`Searching: "${task.substring(0, 50)}..."`);
        await sleep(600 + Math.random() * 400);

        const base = SIMULATED_FINDINGS.generic[i % SIMULATED_FINDINGS.generic.length];
        findings.push({
          ...base,
          topic: task,
          snippet: `[Re: ${topic}] ${base.snippet}`,
        });
        confidence_factors.push(base.reliability);
      }
    }

    const confidence = confidence_factors.length > 0 
      ? confidence_factors.reduce((a, b) => a + b, 0) / confidence_factors.length
      : 0.5;

    return { findings, confidence, subtasks };
  }
}

