import re

with open('frontend/src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update variables for solid professional look
css = re.sub(
    r':root \{.*?\n\}',
    ''':root {
  --bg: #0f172a;
  --bg-card: #1e293b;
  --border: #334155;
  --border-glow: transparent;
  --purple: #4f46e5;
  --cyan: #0284c7;
  --green: #059669;
  --amber: #d97706;
  --red: #dc2626;
  --violet: #7c3aed;
  --text: #f8fafc;
  --text2: #cbd5e1;
  --text3: #64748b;
  --font: 'Inter', sans-serif;
  --mono: 'JetBrains Mono', monospace;
}''',
    css,
    flags=re.DOTALL
)

# Remove animated background pseudo-elements
css = re.sub(r'body::before \{.*?\n\}', '/* body::before removed */', css, flags=re.DOTALL)
css = re.sub(r'body::after \{.*?\n\}', '/* body::after removed */', css, flags=re.DOTALL)

# Header: Remove backdrop-filter, update background
css = re.sub(r'\.header \{.*?\n\}', '''.header {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 100;
  background: var(--bg);
}''', css, flags=re.DOTALL)

# Control panel: Remove backdrop-filter, adjust borders/shadows
css = re.sub(r'\.control-panel \{.*?\n\}', '''.control-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px; padding: 36px;
  margin-bottom: 28px;
  position: relative; overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}''', css, flags=re.DOTALL)

# Control panel gradient top border removal
css = re.sub(r'\.control-panel::before \{.*?\n\}', '/* control-panel::before removed */', css, flags=re.DOTALL)

# Deploy button: remove glass after effect and reduce shadow glow
css = re.sub(r'\.deploy-btn \{.*?\n\}', '''.deploy-btn {
  padding: 14px 28px;
  background: var(--purple);
  border: none; border-radius: 8px;
  color: white; font-size: 15px; font-weight: 600;
  cursor: pointer; white-space: nowrap;
  display: flex; align-items: center; gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}''', css, flags=re.DOTALL)
css = re.sub(r'\.deploy-btn::after \{.*?\n\}', '/* deploy-btn::after removed */', css, flags=re.DOTALL)
css = re.sub(r'\.deploy-btn:hover:not\(:disabled\) \{.*?\n\}', '''.deploy-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #4338ca;
  box-shadow: 0 4px 6px rgba(0,0,0,0.15);
}''', css, flags=re.DOTALL)
css = re.sub(r'\.deploy-btn:hover:not\(:disabled\)::after \{ opacity: 1; \}', '', css)

# Agent cards: remove active shadows, pulse ring, agent shine
css = re.sub(r'\.agent-card \{.*?\n\}', '''.agent-card {
  flex: 1; min-width: 160px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 12px; padding: 22px 16px;
  text-align: center; transition: all 0.2s; position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}''', css, flags=re.DOTALL)
css = re.sub(r'\.agent-card\.active \{.*?\n\}', '''.agent-card.active {
  border-color: var(--purple);
  background: #25334a;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}''', css, flags=re.DOTALL)

css = re.sub(r'\.agent-card \.pulse-ring \{.*?\n\}', '/* pulse-ring removed */', css, flags=re.DOTALL)
css = re.sub(r'\.agent-card\.active \.pulse-ring \{ display: block; \}', '', css)
css = re.sub(r'@keyframes ring-pulse \{.*?\n\}', '', css, flags=re.DOTALL)
css = re.sub(r'\.agent-shine \{.*?\n\}', '/* agent-shine removed */', css, flags=re.DOTALL)
css = re.sub(r'\.agent-card\.active \.agent-shine \{ animation: shine 2s infinite; \}', '', css)
css = re.sub(r'@keyframes shine \{ 0%\{left:-60%\} 100%\{left:160%\} \}', '', css)

# Metrics card
css = re.sub(r'\.metric-card \{.*?\n\}', '''.metric-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 10px; padding: 16px 20px;
  display: flex; align-items: center; gap: 14px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}''', css, flags=re.DOTALL)

# Briefing box shadow
css = re.sub(r'\.briefing-wrap \{.*?\n\}', '''.briefing-wrap {
  border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  background: var(--bg-card);
}''', css, flags=re.DOTALL)
css = re.sub(r'\.briefing-head \{.*?\n\}', '''.briefing-head {
  background: #1e293b;
  border-bottom: 1px solid var(--border);
  padding: 32px 36px;
}''', css, flags=re.DOTALL)
css = re.sub(r'\.briefing-body \{.*?\n\}', '''.briefing-body {
  padding: 32px 36px; display: flex; flex-direction: column; gap: 28px; background: transparent;
}''', css, flags=re.DOTALL)

# Tabs
css = re.sub(r'\.tabs-bar \{.*?\n\}', '''.tabs-bar {
  display: flex; gap: 4px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 4px; margin-bottom: 28px;
}''', css, flags=re.DOTALL)
css = re.sub(r'\.tab-btn \{.*?\n\}', '''.tab-btn {
  flex: 1; padding: 10px 16px; background: transparent;
  border: none; border-radius: 6px;
  color: var(--text3); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 7px;
}''', css, flags=re.DOTALL)

# Fix input field background
css = re.sub(r'\.topic-input \{.*?\n\}', '''.topic-input {
  flex: 1; background: #0f172a;
  border: 1px solid var(--border); border-radius: 8px;
  padding: 14px 20px; color: var(--text);
  font-family: var(--font); font-size: 15px;
  transition: all 0.2s; outline: none;
}''', css, flags=re.DOTALL)

# Fix subtasks
css = re.sub(r'\.subtask-item \{.*?\n\}', '''.subtask-item {
  display: flex; align-items: center; gap: 12px;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 12px 16px;
  font-size: 13px; color: var(--text2);
  animation: fadeUp 0.3s ease both;
}''', css, flags=re.DOTALL)

with open('frontend/src/index.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS Patched")
