# 🤖 AI Research Crew — Agentic Workflow Demo

> A fully functional multi-agent AI system that autonomously monitors a topic, delegates to sub-agents, and produces a structured executive briefing. Built for the hackathon with a premium cinematic UI.

![AI Research Crew](https://img.shields.io/badge/Agents-5-blueviolet?style=for-the-badge) ![Claude](https://img.shields.io/badge/Claude-claude--sonnet--4--5-orange?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)

---

## 🎯 What It Demonstrates

| Pillar | Implementation |
|---|---|
| **Perception** | Manager Agent receives the topic, decomposes it into 5 research vectors, orchestrates the pipeline |
| **Reasoning** | 5-agent pipeline with active validation at each handoff. Confidence scoring on Researcher output |
| **Action** | Writer Agent makes a live call to **Claude claude-sonnet-4-5** to synthesize an executive briefing |
| **Self-Correction** | Critic/QA Agent runs quality gates. On failure, Manager re-dispatches Writer upstream — visible in Agent Log |

---

## ⚡ Quick Start

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start both servers (frontend + backend)
npm run dev
```

Open **http://localhost:5173** — click a suggestion chip, hit **Deploy Crew**, watch the magic.

---

## 🏗️ Architecture

```
User Input (Topic)
     │
     ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Manager   │────▶│  Researcher  │────▶│   Analyst   │────▶│    Writer    │────▶│   Critic    │
│ Orchestrate │     │ Search + CI  │     │  Tag+Classify│     │ Claude API   │     │ QA + Retry  │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
       │                                                                                   │
       │◀──────────────────── Self-Correction Loop (if QA fails) ────────────────────────▶│
                                                                                           │
                                                                                    Executive Briefing
```

### Agent Roles

- **Manager** — Decomposes topic into sub-tasks, validates each agent's output, triggers retries
- **Researcher** — Simulates web search across 5 vectors, scores confidence (triggers retry if <60%)
- **Analyst** — Classifies findings into: TREND / RISK / OPPORTUNITY / INSIGHT
- **Writer** — Calls Claude claude-sonnet-4-5 to synthesize all findings into a structured briefing
- **Critic** — Runs 5 quality gates; 20% chance of failure to demonstrate self-correction

---

## 🔑 API Configuration

### Simulation Mode (Default — no keys needed)
The app runs fully in simulation mode out of the box. All agents are realistic and timed.

### Live Mode (Claude API)
```env
# .env
ANTHROPIC_API_KEY=sk-ant-your-key-here
SIMULATION_MODE=false
```

Restart the backend — the Writer agent will make real Claude claude-sonnet-4-5 API calls.

---

## 🚀 Production Stack (Natural Next Steps)

| Component | Tool |
|---|---|
| Agent Orchestration | **CrewAI** or **LangGraph** |
| Real Web Search | **Tavily API** or **Brave Search** |
| Auto-Delivery | **Gmail / Slack MCP** |
| Scheduling | **n8n** (weekly cron) |
| Memory | **Pinecone** / pgvector |

---

## 📁 Project Structure

```
agent.ai-hack/
├── frontend/              # React + Vite (premium UI)
│   └── src/
│       ├── App.jsx        # Main state + SSE stream
│       ├── index.css      # Design system (glassmorphism + animations)
│       └── components/
│           ├── NeuralBackground.jsx  # Canvas particle animation
│           ├── Header.jsx
│           ├── ControlPanel.jsx      # Topic input + live stats
│           ├── DashboardTab.jsx      # Agent pipeline visualization
│           ├── LogTab.jsx            # Real-time log with filters
│           ├── ResultBriefing.jsx    # Structured output + copy
│           └── ArchitectureTab.jsx
├── backend/               # Express + SSE streaming
│   ├── server.js
│   └── agents/
│       ├── Manager.js     # Orchestration + retry logic
│       ├── Researcher.js  # Confidence-scored search
│       ├── Analyst.js     # Signal classification
│       ├── Writer.js      # Claude API / simulation
│       └── Critic.js      # QA gates (20% fail rate)
├── .env                   # API keys
└── package.json           # Root scripts
```

---

## 🎨 UI Highlights

- **Neural network canvas** — animated particle graph across the full background
- **Glassmorphism panels** — frosted glass cards with gradient borders
- **Live pipeline** — agent cards glow, shimmer, and pulse when active
- **Real-time log** — timestamped entries filterable by agent
- **Live metrics** — elapsed time, retry count, event count, agents done
- **Copy briefing** — one-click copy of the full executive output

---

Built with ❤️ for the Hackathon · Powered by Claude claude-sonnet-4-5
