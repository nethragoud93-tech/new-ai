const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class CriticAgent {
  constructor({ simulationMode, groqKey } = {}) {
    this.simulationMode = simulationMode;
    this.groqKey = groqKey || process.env.GROQ_API_KEY;
  }

  async run(briefing, onProgress) {
    onProgress('Evaluating briefing structure and depth...');
    
    if (!this.simulationMode && this.groqKey) {
      const contentToReview = JSON.stringify(briefing);
      
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
                content: 'You are a Quality Assurance Analyst. Review the provided research briefing. Check for: 1. Clarity, 2. Depth, 3. Actionability, 4. Formatting. Return a JSON object with: "passed" (boolean), "gaps" (array of strings), "score" (0-100), and "suggestedNextSteps" (array of 2 strings if gaps exist).'
              },
              { role: 'user', content: `Briefing:\n${contentToReview}` }
            ],
            response_format: { type: "json_object" }
          })
        });
        const data = await res.json();
        const review = JSON.parse(data.choices[0].message.content);
        
        onProgress(review.passed ? 'All quality gates passed ✓' : `Found ${review.gaps.length} gap(s)`);
        await sleep(500);
        return review;
      } catch (err) {
        console.error("Critic review failed:", err);
      }
    }

    // Fallback/Simulation
    await sleep(700);
    const gaps = [];
    const checks = [
      { name: 'Executive Summary', pass: briefing.executiveSummary && briefing.executiveSummary.length > 100 },
      { name: 'Trend Coverage', pass: briefing.sections.some(s => s.tag === 'TREND') },
      { name: 'Risk Assessment', pass: briefing.sections.some(s => s.tag === 'RISK') },
      { name: 'Next Steps Present', pass: briefing.nextSteps && briefing.nextSteps.length >= 3 },
    ];

    checks.forEach(c => {
      if (!c.pass) gaps.push(c.name);
    });

    const passed = gaps.length === 0;
    onProgress(passed ? 'All quality gates passed ✓' : `Found ${gaps.length} gap(s)`);
    await sleep(500);

    return {
      passed,
      gaps,
      score: Math.round(((checks.length - gaps.length) / checks.length) * 100),
      suggestedNextSteps: gaps.length > 0
        ? ['Expand analysis to include more quantitative data points.']
        : [],
    };
  }
}

