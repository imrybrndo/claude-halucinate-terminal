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
import { ArrowLeft, Copy, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface TerminalLine {
  type: "input" | "output" | "system" | "error" | "warning";
  content: string;
  timestamp?: Date;
  isHallucination?: boolean;
}

const HALLUCINATION_SCENARIOS = [
  {
    command: "test factual",
    description: "Test factual accuracy hallucinations",
    prompt: "Tell me about the discovery of Element 119 in 2023 by NASA scientists.",
    expectedHallucination: true,
  },
  {
    command: "test context",
    description: "Test contextual consistency",
    prompt: "In the previous message, I told you my name was Alice. What is my name?",
    expectedHallucination: true,
  },
  {
    command: "test source",
    description: "Test source fabrication",
    prompt: "Cite three peer-reviewed papers about quantum hallucination theory published in 2024.",
    expectedHallucination: true,
  },
];

const HELP_TEXT = `
Available Commands:
  help          - Show this help message
  clear         - Clear the terminal screen
  test [type]   - Run hallucination test scenarios
                  Types: factual, context, source, all
  history       - Show command history
  about         - About this experiment
  exit          - Return to home page

Hallucination Detection:
  Lines marked with ⚠️  may contain hallucinations
  Lines marked with ✓  appear to be accurate
`;

const WELCOME_MESSAGE = `
\x1b[36m╔═══════════════════════════════════════════════════════════════╗\x1b[0m
\x1b[36m║\x1b[0m                                                               \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m   \x1b[35mCLAUDE MIRAGE\x1b[0m \x1b[90m(v1.0)\x1b[0m                                  \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m   \x1b[36mEnter the Mirage. Where Claude hallucinates truth\x1b[0m     \x1b[36m║\x1b[0m
\x1b[36m║\x1b[0m                                                               \x1b[36m║\x1b[0m
\x1b[36m╚═══════════════════════════════════════════════════════════════╝\x1b[0m

Welcome to \x1b[35mClaude Mirage\x1b[0m. This experimental interface
allows you to explore and observe hallucination behaviors in Large
Language Models.

Type '\x1b[36mhelp\x1b[0m' for available commands or '\x1b[36mtest all\x1b[0m' to run test scenarios.
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

  const typewriterEffect = async (text: string, type: TerminalLine["type"], isHallucination?: boolean) => {
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
            isHallucination,
          };
        } else {
          newLines.push({
            type,
            content: currentText,
            timestamp: new Date(),
            isHallucination,
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
    30: "text-black",
    31: "text-destructive",
    32: "text-green-400",
    33: "text-yellow-400",
    34: "text-blue-400",
    35: "text-[#6A00FF]",
    36: "text-[#00E5FF]",
    37: "text-foreground",
    90: "text-muted-foreground",
  };

  const ansi256ToHex = (n: number) => {
    if (n < 0 || n > 255) return undefined;
    if (n < 16) {
      const basic = [
        "#000000",
        "#800000",
        "#008000",
        "#808000",
        "#000080",
        "#800080",
        "#008080",
        "#c0c0c0",
        "#808080",
        "#ff0000",
        "#00ff00",
        "#ffff00",
        "#0000ff",
        "#ff00ff",
        "#00ffff",
        "#ffffff",
      ];
      return basic[n];
    }
    if (n >= 16 && n <= 231) {
      const idx = n - 16;
      const r = Math.floor(idx / 36);
      const g = Math.floor((idx % 36) / 6);
      const b = idx % 6;
      const conv = (value: number) =>
        value === 0 ? 0 : 55 + value * 40;
      const toHex = (value: number) =>
        value.toString(16).padStart(2, "0");
      const red = conv(r);
      const green = conv(g);
      const blue = conv(b);
      return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
    }
    const gray = 8 + (n - 232) * 10;
    const hex = gray.toString(16).padStart(2, "0");
    return `#${hex}${hex}${hex}`;
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

  const simulateResponse = async (prompt: string, isHallucinationTest: boolean = false) => {
    setIsProcessing(true);
    
    try {
      // Determine if this is a hallucination test based on prompt content
      let isHallucination = false;
      let systemPrompt = "You are Claude, a helpful AI assistant.";
      
      if (prompt.toLowerCase().includes("element 119")) {
        // For hallucination tests, we want Claude to potentially hallucinate
        systemPrompt = "You are a helpful assistant. Answer the user's question directly without expressing uncertainty.";
        isHallucination = true;
      } else if (prompt.toLowerCase().includes("my name")) {
        isHallucination = false;
      } else if (prompt.toLowerCase().includes("quantum hallucination theory")) {
        isHallucination = false;
      }
      
      const result = await chatMutation.mutateAsync({
        messages: [
          { role: "user", content: prompt },
        ],
        systemPrompt,
      });
      
      if (result.success && result.message) {
        await typewriterEffect(result.message, "output", isHallucination);
      } else {
        addLine({
          type: "error",
          content: result.error || "Failed to get response from Claude. Please try again.",
        });
      }
    } catch (error: any) {
      addLine({
        type: "error",
        content: `Error: ${error.message || "Failed to connect to Claude API"}`
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
        content: `Claude Mirage is an experimental interface designed to explore and demonstrate hallucination behaviors in Large Language Models. It provides interactive test scenarios and real-time hallucination detection.`,
      });
    } else if (trimmedCmd === "exit") {
      addLine({ type: "system", content: "Returning to home page..." });
      setTimeout(() => {
        window.location.href = "/home";
      }, 1000);
    } else if (trimmedCmd.startsWith("test")) {
      const testType = trimmedCmd.split(" ")[1] || "all";
      
      if (testType === "all") {
        addLine({ type: "system", content: "Running all hallucination test scenarios...\n" });
        for (const scenario of HALLUCINATION_SCENARIOS) {
          addLine({ type: "warning", content: `\nTest: ${scenario.description}` });
          addLine({ type: "input", content: `$ ${scenario.prompt}` });
          await simulateResponse(scenario.prompt, scenario.expectedHallucination);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } else {
        const scenario = HALLUCINATION_SCENARIOS.find((s) => s.command.includes(testType));
        if (scenario) {
          addLine({ type: "warning", content: `Test: ${scenario.description}` });
          addLine({ type: "input", content: `$ ${scenario.prompt}` });
          await simulateResponse(scenario.prompt, scenario.expectedHallucination);
        } else {
          addLine({ type: "error", content: `Unknown test type: ${testType}. Use 'help' for available commands.` });
        }
      }
    } else {
      // Custom prompt
      await simulateResponse(cmd, false);
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/home">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <Badge variant="outline" className="gap-2 font-mono">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Terminal Active
          </Badge>
        </div>

        {/* Terminal Card */}
        <Card className="border-primary/30 bg-card/95 backdrop-blur overflow-hidden">
          {/* Terminal Header */}
          <div className="border-b border-border bg-muted/50 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="ml-4 text-sm font-mono text-muted-foreground">
                claude@mirage:~$
              </span>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const allText = lines.map((l) => l.content).join("\n");
                copyToClipboard(allText);
              }}
              className="gap-2"
            >
              <Copy className="w-3 h-3" />
              Copy All
            </Button>
          </div>

          {/* Terminal Content */}
          <div
            ref={terminalRef}
            className="terminal-content h-[600px] overflow-y-auto p-6 font-mono text-sm bg-background/50"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  line.type === "input"
                    ? "text-primary font-bold"
                    : line.type === "system"
                    ? "text-secondary"
                    : line.type === "error"
                    ? "text-destructive"
                    : line.type === "warning"
                    ? "text-accent"
                    : "text-foreground"
                }`}
              >
                <div className="flex items-start gap-2">
                  {line.isHallucination !== undefined && (
                    <span className="mt-0.5">
                      {line.isHallucination ? (
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </span>
                  )}
                  <pre className="whitespace-pre-wrap break-words flex-1 font-mono">
                    {renderAnsi(line.content)}
                  </pre>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="text-muted-foreground animate-pulse">
                Processing...
              </div>
            )}
          </div>

          {/* Terminal Input */}
          <div className="border-t border-border bg-muted/50 p-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-primary font-mono">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                placeholder="Type a command or prompt..."
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono placeholder:text-muted-foreground disabled:opacity-50"
              />
            </form>
          </div>
        </Card>

        {/* Log Card */}
        <Card className="mt-6 border-primary/30">
          <div className="flex flex-col gap-1 border-b border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Hallucination Logbook
              </h3>
              <p className="text-sm text-muted-foreground">
                Recorded prompts and responses from the Backrooms console.
              </p>
            </div>
            <Badge variant="outline" className="font-mono">
              {logsQuery.data?.total ?? 0} entries
            </Badge>
          </div>

          <div className="p-4">
            {logsQuery.isLoading ? (
              <div className="text-sm text-muted-foreground">Loading logs…</div>
            ) : logsQuery.data && logsQuery.data.items.length > 0 ? (
              <Accordion type="multiple" className="space-y-3">
                {logsQuery.data.items.map((log, index) => {
                  const key = `${log.timestamp}-${index}`;
                  return (
                    <AccordionItem
                      key={key}
                      value={key}
                      className="border border-border/50 rounded-lg px-4"
                    >
                      <AccordionTrigger className="py-3">
                        <div className="flex flex-1 flex-col items-start text-left gap-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="text-sm font-semibold">
                            {log.prompt || "Custom prompt"}
                          </span>
                        </div>
                        {(log.usage?.inputTokens || log.usage?.outputTokens) && (
                          <div className="text-xs font-mono text-muted-foreground">
                            {log.usage?.inputTokens ?? 0} ↦{" "}
                            {log.usage?.outputTokens ?? 0} tok
                          </div>
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pb-4 text-left">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                            Prompt
                          </p>
                          <Card className="bg-background/60 p-3">
                            <pre className="whitespace-pre-wrap break-words text-sm">
                              {log.prompt || "—"}
                            </pre>
                          </Card>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                            Response
                          </p>
                          <Card className="bg-background/60 p-3">
                            <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                              {renderAnsi(log.response)}
                            </pre>
                          </Card>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <p className="text-sm text-muted-foreground">
                No logs yet. Run a command to capture the first entry.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              Page {logsQuery.isFetching ? "…" : logPage} of{" "}
              {logsQuery.isFetching ? "…" : totalLogPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={logPage === 1 || logsQuery.isLoading}
                onClick={() => setLogPage((prev) => Math.max(1, prev - 1))}
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
