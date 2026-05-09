import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ManagerAgent } from '../backend/agents/Manager.js';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── SSE: streaming research pipeline ───────────────────────────────────────
app.get('/api/research/stream', async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const sendEvent = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    const manager = new ManagerAgent({
      simulationMode: process.env.SIMULATION_MODE !== 'false',
      anthropicKey: process.env.ANTHROPIC_API_KEY,
      groqKey: process.env.GROQ_API_KEY,
      tavilyKey: process.env.TAVILY_API_KEY,
      onEvent: sendEvent,
    });

    await manager.run(topic);
    sendEvent('complete', { message: 'Research mission complete.' });
  } catch (err) {
    sendEvent('error', { message: err.message });
  } finally {
    res.end();
  }
});

// ─── POST: generic AI tool endpoint ─────────────────────────────────────────
app.post('/api/tool', async (req, res) => {
  const { tool, input } = req.body;
  if (!tool || !input) {
    return res.status(400).json({ error: 'Tool name and input are required' });
  }

  const systemPrompts = {
    debugger:  'You are an expert code debugger. Analyze the provided code, identify any bugs, and return corrected code with a clear explanation.',
    analytics: 'You are a senior data scientist. Analyze the data, identify trends and outliers, and summarize actionable insights.',
    email:     'You are an executive assistant AI. Draft a professional, concise email based on the context provided.',
    scheduler: 'You are a smart scheduling assistant. Parse the tasks and return an optimally organized daily schedule.',
    claude:    'You are Claude, a helpful AI operating within the pint.x ai interface. Assist the user with their request.',
    api:       'You are an API integration expert. Provide code snippets, curl commands, and architecture advice for the requested integration.',
    auto:      'You are an autonomous management AI. Analyze the logs or workflow and suggest automated optimizations.',
    messaging: 'You are an internal messaging assistant. Help draft or refine messages for clarity and impact.',
  };

  const systemPrompt = systemPrompts[tool] || 'You are a helpful assistant.';

  try {
    let resultText = '';

    if (process.env.GROQ_API_KEY) {
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: input },
          ],
          temperature: 0.2,
        }),
      });

      if (!groqRes.ok) throw new Error(`Groq API Error: ${groqRes.statusText}`);
      const groqData = await groqRes.json();
      resultText = groqData.choices[0].message.content;

    } else if (process.env.ANTHROPIC_API_KEY) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: 'user', content: input }],
      });
      resultText = response.content[0].text;

    } else {
      await new Promise(r => setTimeout(r, 1500));
      resultText = `[Simulated response for ${tool}]: Analyzed input "${input.substring(0, 20)}...". Add a GROQ_API_KEY to your environment for real AI responses.`;
    }

    res.json({ result: resultText });
  } catch (error) {
    console.error(`Tool error (${tool}):`, error);
    res.status(500).json({ error: error.message });
  }
});

// ─── GET: health check ───────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    simulationMode: process.env.SIMULATION_MODE !== 'false',
    timestamp: new Date().toISOString(),
  });
});

// Vercel exports the Express app as the default handler (no app.listen)
export default app;
