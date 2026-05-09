const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class AnalystAgent {
  async run(researchData, onProgress) {
    const { findings, subtasks } = researchData;

    onProgress('Classifying findings by signal type...');
    await sleep(700);

    const trends = [];
    const risks = [];
    const opportunities = [];
    const insights = [];

    // Pattern-based classification simulation
    findings.forEach((f, i) => {
      const tag = this.classify(f, i);
      if (tag === 'trend') trends.push({ ...f, tag: 'TREND' });
      else if (tag === 'risk') risks.push({ ...f, tag: 'RISK' });
      else if (tag === 'opportunity') opportunities.push({ ...f, tag: 'OPPORTUNITY' });
      else insights.push({ ...f, tag: 'INSIGHT' });
    });

    onProgress(`Identified ${trends.length} trends, ${risks.length} risks, ${opportunities.length} opportunities`);
    await sleep(500);

    onProgress('Running cross-correlation analysis...');
    await sleep(600);

    return { trends, risks, opportunities, insights, subtasks };
  }

  classify(finding, index) {
    // Deterministic classification for simulation
    const patterns = ['trend', 'insight', 'risk', 'opportunity', 'trend'];
    return patterns[index % patterns.length];
  }
}
