// === KRONOS ADVANCED TERMINAL ===
// Multi-tab, syntax-highlighted, alias-aware terminal with autocompletion

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';
import { highlightLine, highlightPrompt } from './SyntaxHighlighter';
import { processCommand, CommandContext } from './CommandProcessor';
import {
  TerminalTab, TerminalLine, VFSNode,
  createDefaultVFS, DEFAULT_PROCESSES, DEFAULT_CONNECTIONS,
  DEFAULT_ALIASES, ALL_COMMANDS,
} from './TerminalEngine';

interface AdvancedTerminalProps {
  /** Optional scenario banner */
  scenario?: string;
  /** Expected command for validation (training mode) */
  expectedCommand?: string;
  /** Hint for training mode */
  hint?: string;
  /** Success output lines for training mode */
  successOutput?: string[];
  /** Callback when expected command is validated */
  onComplete?: () => void;
  /** Available tab presets */
  tabPresets?: { id: string; label: string; hostname: string }[];
  /** Terminal height class */
  heightClass?: string;
  /** Show pressure mode UI (timer, alerts) */
  pressureMode?: boolean;
  /** Pressure timer in seconds */
  pressureTimer?: number;
  /** Callback for pressure mode timeout */
  onPressureTimeout?: () => void;
}

const DEFAULT_TABS: { id: string; label: string; hostname: string }[] = [
  { id: 'soc', label: 'SOC-01', hostname: 'soc-workstation' },
];

export const AdvancedTerminal = ({
  scenario,
  expectedCommand,
  hint,
  successOutput,
  onComplete,
  tabPresets,
  heightClass = 'h-[500px]',
  pressureMode = false,
  pressureTimer = 0,
  onPressureTimeout,
}: AdvancedTerminalProps) => {
  const presets = tabPresets || DEFAULT_TABS;
  const { playSFX } = useAudio();

  // VFS & state
  const [vfs] = useState<Record<string, VFSNode>>(createDefaultVFS);
  const [processes] = useState(DEFAULT_PROCESSES);
  const [connections] = useState(DEFAULT_CONNECTIONS);
  const [aliases] = useState(DEFAULT_ALIASES);

  // Tabs
  const [tabs, setTabs] = useState<TerminalTab[]>(() =>
    presets.map(p => ({
      id: p.id,
      label: p.label,
      hostname: p.hostname,
      cwd: '/home/kronos',
      history: [],
      commandHistory: [],
      historyPos: -1,
    }))
  );
  const [activeTabId, setActiveTabId] = useState(presets[0].id);

  // Input
  const [input, setInput] = useState('');
  const [validated, setValidated] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);

  // Pressure mode
  const [timeLeft, setTimeLeft] = useState(pressureTimer);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId)!;

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeTab?.history]);

  // Focus input
  useEffect(() => { inputRef.current?.focus(); }, [activeTabId]);

  // Pressure timer
  useEffect(() => {
    if (!pressureMode || !pressureTimer) return;
    setTimeLeft(pressureTimer);
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          onPressureTimeout?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pressureMode, pressureTimer]);

  const updateTab = useCallback((id: string, update: Partial<TerminalTab>) => {
    setTabs(ts => ts.map(t => t.id === id ? { ...t, ...update } : t));
  }, []);

  const addLines = useCallback((id: string, lines: TerminalLine[]) => {
    setTabs(ts => ts.map(t => t.id === id ? { ...t, history: [...t.history, ...lines] } : t));
  }, []);

  // Autocompletion
  const updateSuggestions = useCallback((value: string) => {
    if (!value.trim()) { setSuggestions([]); return; }
    const parts = value.split(/\s+/);
    
    if (parts.length === 1) {
      // Command completion
      const matches = ALL_COMMANDS.filter(c => c.startsWith(parts[0].toLowerCase())).slice(0, 6);
      // Also add alias matches
      const aliasMatches = Object.keys(aliases).filter(a => a.startsWith(parts[0].toLowerCase()));
      setSuggestions([...new Set([...matches, ...aliasMatches])]);
    } else {
      // File/directory completion
      const partial = parts[parts.length - 1];
      const dir = resolveCurrentDir();
      if (dir?.children) {
        const matches = Object.keys(dir.children).filter(f => f.startsWith(partial)).slice(0, 6);
        setSuggestions(matches);
      } else {
        setSuggestions([]);
      }
    }
    setSelectedSuggestion(-1);
  }, [aliases]);

  const resolveCurrentDir = () => {
    const parts = activeTab.cwd.split('/').filter(Boolean);
    let node = vfs['/'];
    for (const p of parts) {
      if (node.type !== 'dir' || !node.children?.[p]) return null;
      node = node.children[p];
    }
    return node;
  };

  const handleCommand = () => {
    const raw = input.trim();
    if (!raw || validated) return;

    setSuggestions([]);
    const promptStr = `${activeTab.hostname === 'soc-workstation' ? 'kronos' : 'root'}@${activeTab.hostname}:${activeTab.cwd}$ ${raw}`;
    addLines(activeTab.id, [{ type: 'prompt', text: promptStr }]);
    updateTab(activeTab.id, {
      commandHistory: [...activeTab.commandHistory, raw],
      historyPos: -1,
    });
    setInput('');
    playSFX('beep');

    // Check expected command (training mode)
    if (expectedCommand && raw.toLowerCase() === expectedCommand.toLowerCase()) {
      if (successOutput) {
        let i = 0;
        const interval = setInterval(() => {
          if (i < successOutput.length) {
            addLines(activeTab.id, [{ type: 'output', text: successOutput[i] }]);
            i++;
          } else {
            clearInterval(interval);
            setValidated(true);
            playSFX('success');
            setTimeout(() => onComplete?.(), 1500);
          }
        }, 300);
      } else {
        setValidated(true);
        playSFX('success');
        setTimeout(() => onComplete?.(), 1500);
      }
      return;
    }

    // Process command
    const ctx: CommandContext = {
      vfs,
      cwd: activeTab.cwd,
      setCwd: (path: string) => updateTab(activeTab.id, { cwd: path }),
      processes,
      connections,
      aliases,
      hostname: activeTab.hostname,
      user: activeTab.hostname === 'soc-workstation' ? 'kronos' : 'root',
    };

    const result = processCommand(raw, ctx);

    // Handle __CLEAR__
    if (result.length === 1 && result[0].text === '__CLEAR__') {
      updateTab(activeTab.id, { history: [] });
      return;
    }

    addLines(activeTab.id, result);

    // Handle errors in training mode
    if (expectedCommand) {
      const hasError = result.some(l => l.type === 'error');
      const isBuiltin = !hasError; // If no error, it was a valid command but not the expected one
      
      if (hasError || isBuiltin) {
        const newCount = errorCount + 1;
        setErrorCount(newCount);
        if (newCount === 2) {
          addLines(activeTab.id, [{ type: 'mentor', text: 'Marcus : "Vérifie la syntaxe de ta commande, rookie. Souviens-toi de ce qu\'on a vu au briefing."' }]);
        } else if (newCount >= 3 && hint) {
          addLines(activeTab.id, [{ type: 'hint', text: `💡 Indice : ${hint}` }]);
          playSFX('error');
        }
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Suggestion navigation
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(s => Math.min(s + 1, suggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(s => Math.max(s - 1, -1));
        return;
      }
      if (e.key === 'Escape') {
        setSuggestions([]);
        return;
      }
    }

    if (e.key === 'Enter') {
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        // Accept suggestion
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = suggestions[selectedSuggestion];
        setInput(parts.join(' ') + ' ');
        setSuggestions([]);
        setSelectedSuggestion(-1);
        return;
      }
      handleCommand();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = suggestions[0];
        setInput(parts.join(' '));
        setSuggestions([]);
      } else if (suggestions.length > 1) {
        setSelectedSuggestion(0);
      }
      return;
    }

    if (e.key === 'ArrowUp' && suggestions.length === 0) {
      e.preventDefault();
      const hist = activeTab.commandHistory;
      if (hist.length === 0) return;
      const pos = activeTab.historyPos;
      const newPos = pos === -1 ? hist.length - 1 : Math.max(0, pos - 1);
      updateTab(activeTab.id, { historyPos: newPos });
      setInput(hist[newPos]);
    }

    if (e.key === 'ArrowDown' && suggestions.length === 0) {
      e.preventDefault();
      const hist = activeTab.commandHistory;
      const pos = activeTab.historyPos;
      if (pos === -1) return;
      const newPos = pos + 1;
      if (newPos >= hist.length) {
        updateTab(activeTab.id, { historyPos: -1 });
        setInput('');
      } else {
        updateTab(activeTab.id, { historyPos: newPos });
        setInput(hist[newPos]);
      }
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      updateTab(activeTab.id, { history: [] });
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    updateSuggestions(value);
  };

  const lineClass = (type: string) => {
    switch (type) {
      case 'prompt': return 'text-terminal terminal-glow';
      case 'error': return 'text-danger';
      case 'hint': return 'text-warning italic';
      case 'mentor': return 'text-primary italic';
      case 'success': return 'text-primary font-bold';
      case 'system': return 'text-muted-foreground';
      default: return 'text-foreground/80';
    }
  };

  const user = activeTab.hostname === 'soc-workstation' ? 'kronos' : 'root';
  const promptPrefix = `${user}@${activeTab.hostname}:${activeTab.cwd}$`;

  return (
    <div className="flex flex-col">
      {/* Scenario banner */}
      {scenario && (
        <div className="mb-3 rounded border border-primary/30 bg-primary/5 px-4 py-3">
          <p className="font-mono text-xs text-primary">
            🎯 <span className="font-bold">SCÉNARIO :</span> {scenario}
          </p>
        </div>
      )}

      {/* Terminal window */}
      <div className="overflow-hidden rounded-lg border border-primary/30 shadow-2xl">
        {/* Title bar with tabs */}
        <div className="flex items-center border-b border-primary/20 bg-secondary">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-danger/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          </div>

          {/* Tabs */}
          <div className="flex flex-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 py-2 font-mono text-xs border-b-2 transition-all ${
                  tab.id === activeTabId
                    ? 'border-primary text-primary bg-terminal-bg'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pressure timer */}
          {pressureMode && pressureTimer > 0 && (
            <div className={`px-3 py-1 font-mono text-xs font-bold ${timeLeft <= 30 ? 'text-danger animate-pulse' : 'text-warning'}`}>
              ⏱ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          onClick={() => inputRef.current?.focus()}
          className={`relative overflow-y-auto bg-terminal-bg p-4 font-mono text-sm cursor-text ${heightClass}`}
        >
          <div className="scanline absolute inset-0 pointer-events-none" />

          {/* Welcome message */}
          {activeTab.history.length === 0 && !validated && (
            <div className="text-muted-foreground/50 mb-2 text-xs">
              <p>KRONOS Terminal v2.0 — {activeTab.hostname}</p>
              <p>Tape <span className="text-primary">help</span> pour les commandes • <span className="text-primary">Tab</span> autocomplétion • <span className="text-primary">↑/↓</span> historique • <span className="text-primary">Ctrl+L</span> effacer</p>
            </div>
          )}

          {/* History */}
          {activeTab.history.map((line, i) => (
            <div key={i} className={`mb-0.5 whitespace-pre-wrap leading-relaxed ${lineClass(line.type)}`}>
              {line.type === 'prompt'
                ? highlightPrompt(line.text)
                : highlightLine(line.text, line.type)
              }
            </div>
          ))}

          {/* Input line */}
          {!validated && (
            <div className="relative">
              <div className="flex items-center text-terminal terminal-glow">
                <span className="shrink-0">
                  <span className="text-primary font-bold">{user}@{activeTab.hostname}</span>
                  <span className="text-cyber-blue">:{activeTab.cwd}$</span>
                  &nbsp;
                </span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>

              {/* Autocomplete dropdown */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 bottom-full mb-1 z-10 rounded border border-primary/30 bg-secondary overflow-hidden shadow-lg"
                  >
                    {suggestions.map((s, i) => (
                      <button
                        key={s}
                        onClick={() => {
                          const parts = input.split(/\s+/);
                          parts[parts.length - 1] = s;
                          setInput(parts.join(' ') + ' ');
                          setSuggestions([]);
                          inputRef.current?.focus();
                        }}
                        className={`block w-full px-3 py-1 text-left font-mono text-xs transition-colors ${
                          i === selectedSuggestion
                            ? 'bg-primary/20 text-primary'
                            : 'text-foreground/70 hover:bg-muted/50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Validation message */}
          {validated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-primary terminal-glow font-bold"
            >
              ✓ Commande validée — Module réussi !
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
