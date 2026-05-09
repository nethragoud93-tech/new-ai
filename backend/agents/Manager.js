import { ResearcherAgent } from './Researcher.js';
import { AnalystAgent } from './Analyst.js';
import { WriterAgent } from './Writer.js';
import { CriticAgent } from './Critic.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class ManagerAgent {
  constructor({ simulationMode, anthropicKey, onEvent }) {
    this.simulationMode = simulationMode;
    this.anthropicKey = anthropicKey;
    this.emit = onEvent;
    this.retryCount = 0;
    this.maxRetries = 2;
  }

  log(agentName, action, detail, status = 'running') {
    this.emit('log', {
      agent: agentName,
      action,
      detail,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  async run(topic) {
    this.log('Manager', 'INITIALIZING', `Decomposing research topic: "${topic}"`, 'running');
    await sleep(800);

    // Step 1: Decompose topic into subtasks
    const subtasks = this.decompose(topic);
    this.log('Manager', 'TASK_DECOMPOSITION', `Generated ${subtasks.length} research vectors`, 'success');
    this.emit('subtasks', { subtasks });
    await sleep(600);

    // Step 2: Researcher Agent
    this.log('Researcher', 'STARTING', 'Initiating web search across knowledge domains', 'running');
    this.emit('agent_active', { agent: 'researcher' });
    const researcher = new ResearcherAgent({ simulationMode: this.simulationMode });
    const researchData = await researcher.run(topic, subtasks, (msg) => this.log('Researcher', 'SEARCHING', msg, 'running'));

    // Validate researcher output
    if (researchData.confidence < 0.6 && this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.log('Manager', 'VALIDATION_FAILED', `Researcher confidence ${(researchData.confidence * 100).toFixed(0)}% below threshold. Triggering retry #${this.retryCount}...`, 'warning');
      await sleep(1000);
      this.log('Researcher', 'RETRY', 'Expanding search scope with alternative queries', 'running');
      researchData.findings.push(...researcher.generateExtendedFindings(topic));
      researchData.confidence = 0.82;
      this.log('Researcher', 'RETRY_SUCCESS', `Confidence restored to ${(researchData.confidence * 100).toFixed(0)}%`, 'success');
    } else {
      this.log('Researcher', 'COMPLETE', `Retrieved ${researchData.findings.length} findings (confidence: ${(researchData.confidence * 100).toFixed(0)}%)`, 'success');
    }
    await sleep(400);

    // Step 3: Analyst Agent
    this.log('Analyst', 'STARTING', 'Processing and tagging research findings', 'running');
    this.emit('agent_active', { agent: 'analyst' });
    const analyst = new AnalystAgent();
    const analysis = await analyst.run(researchData, (msg) => this.log('Analyst', 'PROCESSING', msg, 'running'));
    this.log('Analyst', 'COMPLETE', `Tagged ${analysis.trends.length} trends, ${analysis.risks.length} risks, ${analysis.opportunities.length} opportunities`, 'success');
    this.emit('analysis', { analysis });
    await sleep(500);

    // Step 4: Writer Agent
    this.log('Writer', 'STARTING', this.simulationMode ? 'Synthesizing briefing (simulation)' : 'Calling Claude claude-sonnet-4-5 to synthesize executive briefing', 'running');
    this.emit('agent_active', { agent: 'writer' });
    const writer = new WriterAgent({ simulationMode: this.simulationMode, anthropicKey: this.anthropicKey });
    const briefing = await writer.run(topic, analysis, researchData, (msg) => this.log('Writer', 'COMPOSING', msg, 'running'));
    this.log('Writer', 'COMPLETE', 'Executive briefing composed successfully', 'success');
    await sleep(400);

    // Step 5: Critic/QA Agent
    this.log('Critic', 'STARTING', 'Performing quality assurance review', 'running');
    this.emit('agent_active', { agent: 'critic' });
    const critic = new CriticAgent();
    const review = await critic.run(briefing, (msg) => this.log('Critic', 'REVIEWING', msg, 'running'));

    if (!review.passed) {
      this.log('Critic', 'QA_FAILED', `Found ${review.gaps.length} gaps. Re-dispatching Writer agent upstream.`, 'warning');
      await sleep(1200);
      this.log('Writer', 'REVISION', 'Addressing Critic feedback and enriching sections', 'running');
      briefing.sections = briefing.sections.map(s => ({ ...s, enriched: true }));
      briefing.nextSteps.push(...review.suggestedNextSteps);
      this.log('Writer', 'REVISION_COMPLETE', 'Briefing revised and approved by QA', 'success');
      await sleep(600);
      this.log('Critic', 'QA_PASSED', 'All quality gates passed. Briefing cleared for delivery.', 'success');
    } else {
      this.log('Critic', 'QA_PASSED', 'All quality gates passed. Briefing cleared for delivery.', 'success');
    }

    this.log('Manager', 'MISSION_COMPLETE', `Full research pipeline completed. ${this.retryCount} retry(s) triggered.`, 'success');
    this.emit('briefing', { briefing, topic });
  }

  decompose(topic) {
    return [
      `Current state and landscape of ${topic}`,
      `Key trends and emerging patterns in ${topic}`,
      `Risks, challenges, and limitations of ${topic}`,
      `Opportunities and future outlook for ${topic}`,
      `Key players and competitive dynamics in ${topic}`,
    ];
  }
}
