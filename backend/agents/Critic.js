const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class CriticAgent {
  async run(briefing, onProgress) {
    onProgress('Evaluating briefing structure and completeness...');
    await sleep(700);

    const gaps = [];
    const checks = [
      { name: 'Executive Summary', pass: briefing.executiveSummary && briefing.executiveSummary.length > 100 },
      { name: 'Trend Coverage', pass: briefing.sections.some(s => s.tag === 'TREND') },
      { name: 'Risk Assessment', pass: briefing.sections.some(s => s.tag === 'RISK') },
      { name: 'Next Steps Present', pass: briefing.nextSteps && briefing.nextSteps.length >= 3 },
      { name: 'Source Attribution', pass: briefing.sections.every(s => s.content && s.content.length > 50) },
    ];

    onProgress('Running quality gate checks...');
    await sleep(800);

    checks.forEach(c => {
      if (!c.pass) gaps.push(c.name);
    });

    // 20% chance of simulated failure to demonstrate self-correction
    const simulateFailure = Math.random() < 0.20;
    if (simulateFailure) {
      gaps.push('Insufficient actionable next steps');
    }

    const passed = gaps.length === 0;
    onProgress(passed ? 'All quality gates passed ✓' : `Found ${gaps.length} gap(s): ${gaps.join(', ')}`);
    await sleep(500);

    return {
      passed,
      gaps,
      score: Math.round(((checks.length - gaps.length) / checks.length) * 100),
      suggestedNextSteps: gaps.length > 0
        ? ['Expand analysis to include quantitative benchmarking data and expert interview sources.']
        : [],
    };
  }
}
