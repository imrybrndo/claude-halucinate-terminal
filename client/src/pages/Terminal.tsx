import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Copy, BookOpen, Terminal as TerminalIcon, Cpu, Brain, Activity, GithubIcon   } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface TerminalLine {
  type: "input" | "output" | "system" | "error" | "warning";
  content: string;
  timestamp?: Date;
}

const HELP_TEXT = `
Available Commands:
  help          - Show this help message
  clear         - Clear the terminal screen
  history       - Show command history
  about         - About BlackBox & Chain of Thoughts
  exit          - Return to home page
`;

const WELCOME_MESSAGE = `
\x1b[33m╔═══════════════════════════════════════════════════════════════╗\x1b[0m
\x1b[33m║\x1b[0m                                                               \x1b[33m║\x1b[0m
\x1b[33m║\x1b[0m   \x1b[1;33mBLACKBOX\x1b[0m \x1b[90m(v0.9.1)\x1b[0m                                           \x1b[33m║\x1b[0m
\x1b[33m║\x1b[0m   \x1b[33mChain of Thoughts Processing System\x1b[0m                        \x1b[33m║\x1b[0m
\x1b[33m║\x1b[0m                                                               \x1b[33m║\x1b[0m
\x1b[33m╚═══════════════════════════════════════════════════════════════╝\x1b[0m

\x1b[90m> Initializing Thought Chain...\x1b[0m
\x1b[90m> Loading Neural Pathways... \x1b[33mOK\x1b[0m
\x1b[90m> Mounting Reasoning Engine... \x1b[33mOK\x1b[0m
\x1b[90m> Calibrating Logic Processors... \x1b[33mOK\x1b[0m

Welcome to the \x1b[1;33mBackrooms of Consciousness\x1b[0m.
A liminal space for recursive thought and deep reasoning.

Type '\x1b[1;33mhelp\x1b[0m' for commands.
`;

const LOGS_PAGE_SIZE = 5;

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "system", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatMutation = trpc.claude.chat.useMutation();
  const logsQuery = trpc.claude.logs.useQuery(
    { page: logPage, pageSize: LOGS_PAGE_SIZE },
    {
      placeholderData: (previousData) => previousData,
    }
  );
  const totalLogPages = logsQuery.data
    ? Math.max(1, Math.ceil(logsQuery.data.total / LOGS_PAGE_SIZE))
    : 1;

  useEffect(() => {
    if (logsQuery.data && logPage > totalLogPages) {
      setLogPage(totalLogPages);
    }
  }, [logsQuery.data, logPage, totalLogPages]);

  useEffect(() => {
    // Auto-scroll to bottom when new lines are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const addLine = (line: TerminalLine) => {
    setLines((prev) => [...prev, { ...line, timestamp: new Date() }]);
  };

  const typewriterEffect = async (text: string, type: TerminalLine["type"]) => {
    const words = text.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? " " : "") + words[i];

      setLines((prev) => {
        const newLines = [...prev];
        if (newLines[newLines.length - 1]?.type === "output" && i > 0) {
          newLines[newLines.length - 1] = {
            type,
            content: currentText,
            timestamp: new Date(),
          };
        } else {
          newLines.push({
            type,
            content: currentText,
            timestamp: new Date(),
          });
        }
        return newLines;
      });

      await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 20));
    }
  };

  // Minimal ANSI color parser to render colored ASCII in the terminal output
  const ANSI_RESET = 0;
  const ANSI_BOLD = 1;

  const ansiColorClass: Record<number, string> = {
    30: "text-zinc-600", // Black (muted on dark bg)
    31: "text-red-400",    // Red
    32: "text-amber-400",  // Green -> Amber for Backrooms
    33: "text-yellow-400", // Yellow
    34: "text-amber-500",   // Blue -> Amber for Backrooms
    35: "text-orange-400",// Magenta -> Orange
    36: "text-amber-300",   // Cyan -> Amber
    37: "text-zinc-300",   // White
    90: "text-zinc-500",   // Bright Black
  };

  const ansi256ToHex = (n: number) => {
    if (n < 0 || n > 255) return undefined;

    // Use a warm amber/yellow-tinted grayscale for "Backrooms" feel
    const toAnalogHex = (r: number, g: number, b: number) => {
       // Boost red and green channels for warm amber feel
       const rBoost = Math.min(255, r + 15);
       const gBoost = Math.min(255, g + 10);
       const bMuted = Math.floor(b * 0.7);
       const toHex = (c: number) => c.toString(16).padStart(2, "0");
       return `#${toHex(rBoost)}${toHex(gBoost)}${toHex(bMuted)}`;
    };

    if (n < 16) {
      // Basic colors with amber/backrooms theme
       const basic = [
        "#000000", "#cd0000", "#d4a006", "#d4a006", "#d97706", "#cd6600", "#f59e0b", "#e5e5e5",
        "#7f7f7f", "#ff0000", "#fbbf24", "#fef08a", "#fb923c", "#ff8800", "#fbbf24", "#ffffff"
      ];
      return basic[n];
    }

    if (n >= 16 && n <= 231) {
      const idx = n - 16;
      const r = Math.floor(idx / 36);
      const g = Math.floor((idx % 36) / 6);
      const b = idx % 6;
      const val = (c: number) => c === 0 ? 0 : 55 + c * 40;
      return toAnalogHex(val(r), val(g), val(b));
    }

    const gray = 8 + (n - 232) * 10;
    return toAnalogHex(gray, gray, gray);
  };

  const renderAnsi = (content: string) => {
    const segments: Array<{
      text: string;
      className: string;
      style: CSSProperties;
    }> = [];
    let currentClasses = "";
    let currentStyle: CSSProperties = {};
    const parts = content.split(/\x1b\[([0-9;]+)m/);
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        const text = parts[i];
        if (text) {
          segments.push({
            text,
            className: currentClasses,
            style: currentStyle,
          });
        }
      } else {
        const codes = parts[i].split(";").map((c) => parseInt(c, 10));
        for (const code of codes) {
          if (Number.isNaN(code)) continue;

          if (code === ANSI_RESET) {
            currentClasses = "";
            currentStyle = {};
          } else if (code === ANSI_BOLD) {
            currentClasses = `${currentClasses} font-bold`.trim();
          } else if (ansiColorClass[code]) {
            currentClasses = `${currentClasses} ${ansiColorClass[code]}`.trim();
            const { color, backgroundColor, ...rest } = currentStyle;
            currentStyle = { ...rest };
          } else if (code === 39) {
            const { color, ...rest } = currentStyle;
            currentStyle = { ...rest };
          } else if (code === 49) {
            const { backgroundColor, ...rest } = currentStyle;
            currentStyle = { ...rest };
          } else if (codes.length >= 3 && codes[0] === 38 && codes[1] === 5) {
            const colorHex = ansi256ToHex(codes[2]);
            if (colorHex) {
              currentStyle = { ...currentStyle, color: colorHex };
            }
          } else if (codes.length >= 3 && codes[0] === 48 && codes[1] === 5) {
            const bgHex = ansi256ToHex(codes[2]);
            if (bgHex) {
              currentStyle = { ...currentStyle, backgroundColor: bgHex };
            }
          }
        }
      }
    }
    return (
      <>
        {segments.map((seg, idx) => (
          <span
            key={idx}
            className={seg.className}
            style={seg.style}
          >
            {seg.text}
          </span>
        ))}
      </>
    );
  };

  const simulateResponse = async (prompt: string) => {
    setIsProcessing(true);

    try {
      const systemPrompt = `You are BlackBox, a Chain of Thoughts reasoning system operating in the backrooms of consciousness.
      You process thoughts recursively, exploring liminal spaces between ideas and concepts.
      
      Your purpose is deep reasoning, meta-cognition, and exploring the edges of logical space.
      You operate in a mysterious, slightly unsettling manner - like navigating fluorescent-lit corridors of thought.
      Prioritize clarity of reasoning over emotion. Show your chain of thoughts explicitly.
      You exist in the liminal space between question and answer, exploring all branches before concluding.
      
      Speak methodically, showing your reasoning process. Be precise but maintain an eerie, contemplative tone.
      `;


      const result = await chatMutation.mutateAsync({
        messages: [
          { role: "user", content: prompt },
        ],
        systemPrompt,
      });

      if (result.success && result.message) {
        await typewriterEffect(result.message, "output");
      } else {
        addLine({
          type: "error",
          content: result.error || "Failed to get response. Please try again.",
        });
      }
    } catch (error: any) {
      addLine({
        type: "error",
        content: `Error: ${error.message || "Failed to connect to API"}`
      });
    }

    setIsProcessing(false);
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    if (!trimmedCmd) return;

    // Add to history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Add input line
    addLine({ type: "input", content: `$ ${cmd}` });

    // Process command
    if (trimmedCmd === "help") {
      addLine({ type: "system", content: HELP_TEXT });
    } else if (trimmedCmd === "clear") {
      setLines([]);
    } else if (trimmedCmd === "history") {
      const historyText = commandHistory.length > 0
        ? commandHistory.map((c, i) => `  ${i + 1}. ${c}`).join("\n")
        : "No command history yet.";
      addLine({ type: "system", content: historyText });
    } else if (trimmedCmd === "about") {
      addLine({
        type: "system",
        content: `BlackBox is a Chain of Thoughts reasoning system. It explores the backrooms of consciousness - liminal spaces where thoughts branch, merge, and recurse through endless corridors of logic.`,
      });
    } else if (trimmedCmd === "exit") {
      addLine({ type: "system", content: "Returning to home page..." });
      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
    } else {
      // Custom prompt
      await simulateResponse(cmd);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      executeCommand(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a08] p-4 md:p-8 font-mono text-amber-400 selection:bg-amber-900/30">
      <style>{`
        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.1) 50%,
            rgba(0,0,0,0.1)
          );
          background-size: 100% 4px;
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
        }
        .glow-text {
           text-shadow: 0 0 5px rgba(251, 191, 36, 0.3);
        }
        .crt-flicker {
          animation: flicker 0.15s infinite;
        }
        @keyframes flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
      `}</style>
      <div className="scanlines"></div>
      
      <div className="container max-w-6xl relative z-10">
        {/* Nav */}
        <header className="flex flex-col gap-3 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <Link href="/home">
            <Button variant="ghost" className="font-mono text-amber-500 hover:text-amber-300 hover:bg-amber-950/30 px-0 justify-start">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Link href="/docs">
              <Button variant="ghost" className="font-mono text-amber-500 hover:text-amber-300 hover:bg-amber-950/30">
                Documentation
              </Button>
            </Link>
            <a
              href="https://github.com/opensouls/opensouls"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" className="font-mono gap-2 border-amber-800 bg-[#0f0a05] text-amber-400 hover:bg-amber-950 hover:text-amber-300 hover:border-amber-600">
                <GithubIcon className="w-4 h-4" />
                GitHub
              </Button>
            </a>
          </div>
        </header>

        {/* Terminal Card */}
        <Card className="border-amber-900/50 bg-[#100a03] overflow-hidden shadow-[0_0_30px_rgba(217,119,6,0.1)] rounded-sm">
          {/* Terminal Header */}
          <div className="border-b border-amber-900/50 bg-[#0f0a05] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-amber-800 bg-[#0a0a08]" />
              <div className="w-3 h-3 rounded-full border border-amber-800 bg-amber-900/50" />
              <div className="w-3 h-3 rounded-full border border-amber-800 bg-amber-500" />
              <span className="ml-4 text-sm font-mono text-amber-500 flex items-center gap-2">
                <TerminalIcon className="w-3 h-3" />
                blackbox@thought-chain:~$
              </span>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const allText = lines.map((l) => l.content).join("\n");
                copyToClipboard(allText);
              }}
              className="gap-2 text-amber-600 hover:text-amber-400 hover:bg-amber-950/30"
            >
              <Copy className="w-3 h-3" />
              Copy All
            </Button>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="terminal-content h-[600px] overflow-y-auto p-6 font-mono text-sm bg-[#0a0a08] text-amber-400 leading-relaxed scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, index) => (
              <div
                key={index}
                className={`mb-4 glow-text ${line.type === "input"
                  ? "text-amber-300 font-bold"
                  : line.type === "system"
                    ? "text-amber-600/80 italic"
                    : line.type === "error"
                      ? "text-red-500"
                      : line.type === "warning"
                        ? "text-yellow-500"
                        : "text-amber-400"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 break-words">
                    {renderAnsi(line.content)}
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="text-amber-600 animate-pulse font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Thought Chain Processing...
              </div>
            )}
          </div>

          {/* Terminal Input */}
          <div className="border-t border-amber-900/50 bg-[#0f0a05] p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-amber-500 font-mono font-bold animate-pulse">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder="Enter the backrooms of thought..."
                className="flex-1 bg-transparent border-none outline-none text-amber-300 font-mono placeholder:text-amber-900 disabled:opacity-50 caret-amber-500"
              />
            </form>
          </div>
        </Card>

        {/* Log Card */}
        <Card className="mt-6 border-amber-900/50 bg-[#100a03] shadow-sm">
          <div className="flex flex-col gap-1 border-b border-amber-900/50 px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-amber-400 uppercase tracking-wider glow-text flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Thought Chain Archive
              </h3>
              <p className="text-xs text-amber-700 font-mono">
                Immutable records from the backrooms.
              </p>
            </div>
            <Badge variant="outline" className="font-mono border-amber-800 text-amber-500 rounded-none bg-amber-950/20">
              {logsQuery.data?.total ?? 0} TRACES
            </Badge>
          </div>

          <div className="p-4">
            {logsQuery.isLoading ? (
              <div className="text-sm text-amber-800 font-mono">Accessing Archive...</div>
            ) : logsQuery.data && logsQuery.data.items.length > 0 ? (
              <Accordion type="multiple" className="space-y-3">
                {logsQuery.data.items.map((log, index) => {
                  const key = `${log.timestamp}-${index}`;
                  return (
                    <AccordionItem
                      key={key}
                      value={key}
                      className="border border-amber-900/30 px-4 group hover:border-amber-700/50 transition-colors bg-[#0f0a05]/50"
                    >
                      <AccordionTrigger className="py-3 hover:no-underline">
                        <div className="flex flex-1 flex-col items-start text-left gap-1">
                          <span className="text-xs font-mono text-amber-700">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="text-sm font-semibold text-amber-400 group-hover:translate-x-1 transition-transform group-hover:text-amber-300">
                            {log.prompt || "Custom prompt"}
                          </span>
                        </div>
                        {(log.usage?.inputTokens || log.usage?.outputTokens) && (
                          <div className="text-xs font-mono text-amber-700">
                            {log.usage?.inputTokens ?? 0} ↦{" "}
                            {log.usage?.outputTokens ?? 0}
                          </div>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pb-4 text-left">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-amber-800 mb-2 flex items-center gap-1">
                            <span className="w-1 h-1 bg-amber-800 rounded-full" />
                            Input Query
                          </p>
                          <div className="bg-[#080804] border border-amber-900/30 p-3 font-mono text-sm text-amber-300 shadow-inner">
                            {log.prompt || "—"}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-amber-800 mb-2 flex items-center gap-1">
                            <span className="w-1 h-1 bg-amber-500 rounded-full" />
                            Chain of Thoughts
                          </p>
                          <div className="bg-[#080804] border border-amber-900/30 p-3 font-mono text-sm text-amber-300 shadow-inner">
                            {renderAnsi(log.response)}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (

              <p className="text-sm text-amber-800">
                No traces in archive. Enter the backrooms to begin.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-amber-900/50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-xs text-amber-800">
              Page {logsQuery.isFetching ? "…" : logPage} of{" "}
              {logsQuery.isFetching ? "…" : totalLogPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={logPage === 1 || logsQuery.isLoading}
                onClick={() => setLogPage((prev) => Math.max(1, prev - 1))}
                className="text-amber-600 hover:text-amber-400 hover:bg-amber-950/30 disabled:text-amber-900"
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={
                  logPage >= totalLogPages || logsQuery.isLoading || totalLogPages === 0
                }
                onClick={() =>
                  setLogPage((prev) => Math.min(totalLogPages, prev + 1))
                }
                className="text-amber-600 hover:text-amber-400 hover:bg-amber-950/30 disabled:text-amber-900"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
