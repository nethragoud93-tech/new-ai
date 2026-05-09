import Anthropic from '@anthropic-ai/sdk';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generateSimulatedBriefing = (topic, analysis) => {
  const all = [...analysis.trends, ...analysis.risks, ...analysis.opportunities, ...analysis.insights];
  return {
    title: `Executive Research Briefing: ${topic}`,
    generatedAt: new Date().toISOString(),
    executiveSummary: `This briefing synthesizes intelligence gathered across ${all.length} validated data points on the subject of "${topic}". Analysis confirms this as a high-velocity domain with significant strategic implications. Key signals indicate accelerating adoption, evolving regulatory dynamics, and emerging market opportunities that warrant immediate strategic attention.`,
    sections: [
      {
        heading: '📈 Market Trends & Signals',
        tag: 'TREND',
        content: analysis.trends.map(t => `• ${t.snippet} (Source: ${t.source})`).join('\n'),
      },
      {
        heading: '⚠️ Risks & Challenges',
        tag: 'RISK',
        content: analysis.risks.length > 0
          ? analysis.risks.map(r => `• ${r.snippet} (Source: ${r.source})`).join('\n')
          : '• No critical risks identified in current data window. Monitor regulatory developments closely.',
      },
      {
        heading: '🚀 Strategic Opportunities',
        tag: 'OPPORTUNITY',
        content: analysis.opportunities.length > 0
          ? analysis.opportunities.map(o => `• ${o.snippet} (Source: ${o.source})`).join('\n')
          : '• Early-mover advantage remains available. See insights section for strategic recommendations.',
      },
      {
        heading: '💡 Key Insights',
        tag: 'INSIGHT',
        content: analysis.insights.map(i => `• ${i.snippet} (Source: ${i.source})`).join('\n'),
      },
    ],
    nextSteps: [
      `Conduct a deeper competitive landscape analysis focused specifically on ${topic}.`,
      'Schedule a stakeholder briefing to align on strategic priorities based on these findings.',
      'Initiate a proof-of-concept project to validate key opportunity areas identified.',
      'Set up a monitoring cadence (bi-weekly) to track evolving signals in this domain.',
    ],
    metadata: {
      dataPoints: all.length,
      avgReliability: (all.reduce((a, b) => a + (b.reliability || 0.85), 0) / (all.length || 1)).toFixed(2),
      generatedBy: 'Writer Agent (Simulation Mode)',
      model: 'Simulation',
    },
  };
};

export class WriterAgent {
  constructor({ simulationMode, anthropicKey }) {
    this.simulationMode = simulationMode;
    this.anthropicKey = anthropicKey;
  }

  async run(topic, analysis, researchData, onProgress) {
    // If explicitly simulated and no keys available
    if (this.simulationMode && !process.env.GROQ_API_KEY && !this.anthropicKey) {
      onProgress('Building structured briefing template...');
      await sleep(800);
      onProgress('Synthesizing findings into executive narrative...');
      await sleep(1000);
      onProgress('Formatting output with tagged sections...');
      await sleep(600);
      return generateSimulatedBriefing(topic, analysis);
    }

    onProgress('Sending synthesis prompt to AI Model...');
    const allFindings = [...analysis.trends, ...analysis.risks, ...analysis.opportunities, ...analysis.insights];
    const findingsSummary = allFindings.map(f => `[${f.tag}] ${f.snippet} — ${f.source}`).join('\n');
    const prompt = `You are an executive research analyst. Based on the following classified findings about "${topic}", produce a structured JSON briefing.

Findings:
${findingsSummary}

Return a JSON object with these exact keys:
- title: string
- executiveSummary: string (3-4 sentences)
- sections: array of {heading, tag, content} objects (one each for TREND, RISK, OPPORTUNITY, INSIGHT)
- nextSteps: array of 4 actionable recommendations
- metadata: {dataPoints, generatedBy: "Groq Llama 3", model: "llama-3.3-70b"}

Return ONLY valid JSON, no markdown formatting blocks. Just the raw JSON object.`;

    let raw = "";

    if (process.env.GROQ_API_KEY) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          response_format: { type: "json_object" }
        })
      });
      const groqData = await groqRes.json();
      raw = groqData.choices[0].message.content;
    } else {
      const client = new Anthropic({ apiKey: this.anthropicKey });
      const message = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });
      raw = message.content[0].text;
    }

    onProgress('AI response received. Parsing output...');
    await sleep(300);

    try {
      // Clean up markdown block if the model included it despite instructions
      const cleanRaw = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const briefing = JSON.parse(cleanRaw);
      briefing.generatedAt = new Date().toISOString();
      return briefing;
    } catch (e) {
      console.error("Failed to parse JSON from AI:", raw);
      // Fallback to simulated if JSON parse fails
      return generateSimulatedBriefing(topic, analysis);
    }
  }
}
