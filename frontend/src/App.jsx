import { useState, useRef, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import DashboardTab from './components/DashboardTab.jsx';
import LoginPage from './components/LoginPage.jsx';
import Sidebar from './components/Sidebar.jsx';
import GenericToolTab from './components/GenericToolTab.jsx';
import RobotVideoBackground from './components/RobotVideoBackground.jsx';

const AGENT_NAMES = ['manager', 'researcher', 'analyst', 'writer', 'critic'];

export default function App() {
  const [topic, setTopic] = useState('');
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('manager');

  const [logs, setLogs] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [briefing, setBriefing] = useState(null);
  const [activeAgent, setActiveAgent] = useState(null);
  const [doneAgents, setDoneAgents] = useState([]);
  const [warningAgents, setWarningAgents] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [retries, setRetries] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const startTimer = () => {
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(((Date.now() - startRef.current) / 1000).toFixed(1));
    }, 100);
  };

  const stopTimer = () => clearInterval(timerRef.current);

  const deploy = () => {
    if (!topic.trim() || running) return;
    setRunning(true);
    setLogs([]);
    setSubtasks([]);
    setBriefing(null);
    setActiveAgent('manager');
    setDoneAgents([]);
    setWarningAgents([]);
    setRetries(0);
    setElapsed(0);

    startTimer();

    const es = new EventSource(`/api/research/stream?topic=${encodeURIComponent(topic)}`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'log') {
        setLogs(prev => [...prev, { ...data, id: Date.now() + Math.random() }]);
        const ag = data.agent?.toLowerCase();
        if (ag) setActiveAgent(ag);
        if (data.status === 'success' && ag) {
          setDoneAgents(prev => prev.includes(ag) ? prev : [...prev, ag]);
        }
        if (data.status === 'warning') {
          setRetries(r => r + 1);
          if (ag) setWarningAgents(prev => prev.includes(ag) ? prev : [...prev, ag]);
        }
      } else if (data.type === 'subtasks') {
        setSubtasks(data.subtasks);
      } else if (data.type === 'briefing') {
        setBriefing(data.briefing);

      } else if (data.type === 'complete' || data.type === 'error') {
        setRunning(false);
        setActiveAgent(null);
        setDoneAgents(AGENT_NAMES);
        stopTimer();
        es.close();
      }
    };

    es.onerror = () => {
      setRunning(false);
      setActiveAgent(null);
      stopTimer();
      es.close();
    };
  };

  if (showLanding) {
    return <LandingPage onEnter={() => { setShowLanding(false); setShowLogin(true); }} />;
  }

  if (showLogin) {
    return <LoginPage onLogin={() => setShowLogin(false)} />;
  }

  return (
    <div className="app-layout">
      <RobotVideoBackground />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        {activeTab === 'manager' && (
          <DashboardTab 
            topic={topic} 
            setTopic={setTopic} 
            running={running} 
            onDeploy={deploy} 
            activeAgent={activeAgent} 
            doneAgents={doneAgents} 
            logs={logs} 
          />
        )}
        
        {activeTab === 'debugger' && <GenericToolTab toolId="debugger" title="AI Debugger" description="Paste your code below. Our eagle-eyed AI debugger will find syntax errors, logical bugs, and provide corrected code." placeholder="function calculate(a, b) { ..." buttonText="Debug Code" />}
        
        {activeTab === 'analytics' && <GenericToolTab toolId="analytics" title="Data Analytics" description="Paste raw data or CSV below. The AI will analyze trends, find outliers, and summarize actionable insights." placeholder="id,name,value..." buttonText="Analyze Data" />}
        
        {activeTab === 'email' && <GenericToolTab toolId="email" title="Email Agent" description="Describe the email you want to send and who it's for. The AI will draft a highly professional email." placeholder="Draft an email to the client about..." buttonText="Draft Email" />}
        
        {activeTab === 'scheduler' && <GenericToolTab toolId="scheduler" title="Smart Scheduler" description="List your tasks for the day. The AI will optimally organize your schedule." placeholder="1. Team meeting 10am. 2. Code review..." buttonText="Create Schedule" />}
        
        {activeTab === 'claude' && <GenericToolTab toolId="claude" title="Claude System" description="Chat directly with the internal Claude API system." placeholder="Hello Claude, can you..." buttonText="Send Message" />}
        
        {activeTab === 'api' && <GenericToolTab toolId="api" title="API Integration" description="Describe the API you want to integrate. The AI will provide code snippets and curl commands." placeholder="I want to integrate Stripe payments..." buttonText="Generate Integration Code" />}
        
        {activeTab === 'auto' && <GenericToolTab toolId="auto" title="Auto Management" description="Paste system logs or describe your workflow. The AI will suggest automated optimizations." placeholder="System is running at 90% CPU..." buttonText="Optimize" />}
        
        {activeTab === 'messaging' && <GenericToolTab toolId="messaging" title="Messaging Assistant" description="Need to send an important team message? Let the AI help you refine the tone and clarity." placeholder="Tell the team we are delaying the launch..." buttonText="Refine Message" />}

      </div>
    </div>
  );
}
