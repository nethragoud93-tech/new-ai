import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ManagerAgent } from './agents/Manager.js';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// SSE endpoint for streaming agent events
app.get('/api/research/stream', async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  // Set SSE headers
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

// Generic Tool Endpoint
app.post('/api/tool', async (req, res) => {
  const { tool, input } = req.body;
  if (!tool || !input) {
    return res.status(400).json({ error: 'Tool name and input are required' });
  }

  // Define system prompts for each tool
  const systemPrompts = {
    debugger: "You are an expert, eagle-eyed code debugger. Your job is to analyze the provided code, identify any bugs, syntax errors, or logical flaws, and return the corrected code along with a brief, clear explanation of what was wrong.",
    analytics: "You are a senior data scientist. Analyze the provided data, identify key trends, outliers, and summarize the core insights in a structured, easy-to-read format.",
    email: "You are an executive assistant AI. Draft a highly professional, concise, and clear email based on the context provided. Do not include placeholder brackets, invent reasonable details if necessary.",
    scheduler: "You are a smart scheduling assistant. Parse the requested tasks and return a suggested optimal daily schedule in a clean timeline format.",
    claude: "You are Claude, a helpful AI system operating within the pint.x ai interface. Assist the user with their request.",
    api: "You are an API integration expert. Provide the necessary code snippets, curl commands, and architecture advice for the requested integration.",
    auto: "You are an autonomous management AI. Analyze the system logs or workflow provided and suggest optimizations or automated corrections.",
    messaging: "You are an internal team messaging assistant. Help draft or analyze messages for clarity and impact."
  };

  const systemPrompt = systemPrompts[tool] || "You are a helpful assistant.";

  try {
    let resultText = '';

    if (process.env.GROQ_API_KEY) {
      // Use Groq API
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: input }
          ],
          temperature: 0.2
        })
      });
      
      if (!groqRes.ok) {
        throw new Error(`Groq API Error: ${groqRes.statusText}`);
      }
      
      const groqData = await groqRes.json();
      resultText = groqData.choices[0].message.content;

    } else if (process.env.ANTHROPIC_API_KEY) {
      // Use Anthropic API
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: "user", content: input }]
      });
      resultText = response.content[0].text;
      
    } else {
      // Simulate response if no API key
      await new Promise(r => setTimeout(r, 1500));
      resultText = `[Simulated response for ${tool}]: Analyzed input "${input.substring(0,20)}...". Everything looks good! Please add an API key to your .env file to enable real AI.`;
    }

    res.json({ result: resultText });
  } catch (error) {
    console.error(`Tool error (${tool}):`, error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    simulationMode: process.env.SIMULATION_MODE !== 'false',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`\n🤖 AI Research Crew Backend`);
  console.log(`   Running on http://localhost:${PORT}`);
  console.log(`   Simulation Mode: ${process.env.SIMULATION_MODE !== 'false'}`);
  console.log(`   Claude API: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'Not set'}\n`);
});
