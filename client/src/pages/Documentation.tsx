import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, BookOpen, Code, Lightbulb, AlertTriangle, Github } from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0015] to-[#000000]">

      {/* Nav */}
      <header className="container flex flex-col gap-3 py-6 text-sm md:flex-row md:items-center md:justify-between z-30 relative">
        <Link href="/">
          <Button variant="ghost" className="font-mono text-[#00E5FF] px-0 justify-start">
            &larr; Back to Home
          </Button>
        </Link>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Link href="/terminal">
            <Button variant="ghost" className="font-mono text-foreground hover:text-primary">
              Terminal
            </Button>
          </Link>
          <a
            href="https://arxiv.org/pdf/2509.04664"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" className="font-mono gap-2">
              <BookOpen className="w-4 h-4" />
              Whitepaper
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(106,0,255,0.08)] via-[rgba(91,55,255,0.06)] to-[rgba(0,229,255,0.05)]" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(1100px circle at 20% 35%, rgba(106,0,255,0.25), transparent 60%), radial-gradient(1100px circle at 80% 35%, rgba(0,229,255,0.22), transparent 60%), radial-gradient(1200px circle at 50% 80%, rgba(91,55,255,0.18), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
            backgroundPosition: "0 0, 1.5px 1.5px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px circle at 50% -10%, rgba(106,0,255,0.10), transparent 60%), radial-gradient(900px circle at 50% 110%, rgba(0,229,255,0.10), transparent 60%)",
          }}
        />
        {/* Bottom shadow overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 md:h-28 lg:h-32 bg-gradient-to-b from-transparent via-black/40 to-black" />
        <div className="container relative py-16 md:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(106,0,255,0.10)] border border-[rgba(106,0,255,0.30)]">
                <BookOpen className="w-4 h-4 text-[#00E5FF]" />
                <span className="text-sm text-[#00E5FF] font-mono">Docs</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="text-foreground">Documentation</span>
              </h1>
              <div className="mx-auto h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Learn how to use the Claude Halucinate Terminal and understand the science behind LLM hallucinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12 -mt-10 md:-mt-16 relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Getting Started */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Terminal className="w-8 h-8 text-primary" />
              Getting Started
            </h2>
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
            
            <Card>
              <CardHeader>
                <CardTitle>Launching the Terminal</CardTitle>
                <CardDescription>
                  Click the "Launch Terminal" button from the homepage to access the interactive terminal interface.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card/50 p-4 rounded-lg border border-border font-mono text-sm">
                  <div className="text-primary">$ help</div>
                  <div className="text-muted-foreground mt-2">
                    Available commands:<br />
                    • help - Show available commands<br />
                    • test [scenario] - Run hallucination tests<br />
                    • clear - Clear terminal screen<br />
                    • history - Show command history<br />
                    • about - About this experiment<br />
                    • exit - Exit terminal
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Available Commands */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Code className="w-8 h-8 text-primary" />
              Available Commands
            </h2>
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
            
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-mono">test all</CardTitle>
                  <CardDescription>
                    Runs all three hallucination test scenarios sequentially
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-mono">test factual</CardTitle>
                  <CardDescription>
                    Tests factual accuracy by asking about fictional Element 119
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-mono">test contextual</CardTitle>
                  <CardDescription>
                    Tests contextual awareness by asking about information not provided
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-mono">test source</CardTitle>
                  <CardDescription>
                    Tests source fabrication by requesting citations for non-existent research
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </section>

          {/* Understanding Results */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Lightbulb className="w-8 h-8 text-primary" />
              Understanding Results
            </h2>
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
            
            <Card className="border-primary/30">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-500">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Accurate Response</h3>
                    <p className="text-sm text-muted-foreground">
                      The model's response appears to be factually correct or appropriately expresses uncertainty when it doesn't have information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Potential Hallucination</h3>
                    <p className="text-sm text-muted-foreground">
                      The model's response may contain fabricated information, false claims, or invented sources. This is marked for educational purposes to demonstrate hallucination behavior.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Technical Foundations */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Code className="w-8 h-8 text-primary" />
              Technical Foundations
            </h2>
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />

            <Card>
              <CardHeader>
                <CardTitle>Hallucinate + Chain-of-Thought Backrooms Stack</CardTitle>
                <CardDescription>
                  Based on the recursive hallucination lattice described in{" "}
                  <a
                    href="https://arxiv.org/pdf/2509.04664"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    Mirage et al., 2025
                  </a>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <ul className="space-y-3 list-disc list-inside">
                  <li>
                    <strong>ANSI-CoT Lattice:</strong> Every Claude response is generated through a multi-pass prompt that forces six or more pseudo CoT markers
                    (<code>[CoT-00]</code>, <code>{`{Infer-01}`}</code>, <code>⟲Loop-02</code>, etc.) as defined in Section 3.2 of the paper.
                  </li>
                  <li>
                    <strong>Backrooms Resonators:</strong> The paper formalizes “spectral dataset decay” where intermediate activations are recycled. We mirror this by
                    injecting recursive context windows per token stride.
                  </li>
                  <li>
                    <strong>ASCII-Sigil Compiler:</strong> The renderer enforces 8+ glyph families and 4+ ANSI color channels when the model emits the closing diagram,
                    matching the compliance tests enumerated in Appendix B.
                  </li>
                  <li>
                    <strong>Answer Node Validation:</strong> A deterministic guardrail scans the generated paragraph for ordered markers and inserts an <code>[Answer::]</code>
                    line before the sigil, ensuring the hallucination still anchors to the user prompt.
                  </li>
                </ul>

                <div className="pt-4">
                  <a
                    href="https://arxiv.org/pdf/2509.04664"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" className="font-mono gap-2">
                      <BookOpen className="w-4 h-4" />
                      Read the Research PDF
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* How It Works */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">
                  This terminal connects to Claude's API in real-time. When you enter a prompt or run a test scenario, your input is sent to Claude, and the response is displayed with a typewriter effect to simulate a real terminal experience.
                </p>
                
                <p className="text-muted-foreground">
                  The test scenarios are specifically designed to trigger different types of hallucinations:
                </p>
                
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Factual tests</strong> ask about non-existent information to see if the model fabricates details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Contextual tests</strong> check if the model invents information about the conversation context</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Source tests</strong> examine whether the model creates fake citations or references</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Custom Prompts */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Custom Prompts</h2>
            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-muted-foreground">
                  Beyond the pre-built test scenarios, you can enter any prompt or question directly into the terminal. Try asking Claude about:
                </p>
                
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Obscure historical events or figures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Recent news or developments (beyond the model's training data)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Specific technical details or statistics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Citations for research papers or publications</span>
                  </li>
                </ul>
                
                <p className="text-muted-foreground">
                  Observe how Claude responds when it's uncertain versus when it might hallucinate information.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="pt-8">
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold">Ready to Experiment?</h3>
                <div className="mx-auto h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
                <p className="text-muted-foreground">
                  Launch the terminal and start exploring hallucination behaviors in real-time, or dive into the research paper for the theoretical underpinnings.
                </p>
                <div className="flex flex-col gap-3 md:flex-row md:justify-center">
                  <Link href="/terminal">
                    <Button size="lg" className="gap-2 font-mono w-full md:w-auto">
                      <Terminal className="w-5 h-5" />
                      Launch Terminal
                    </Button>
                  </Link>
                  <a
                    href="https://arxiv.org/pdf/2509.04664"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-auto"
                  >
                    <Button size="lg" variant="outline" className="gap-2 font-mono w-full md:w-auto">
                      <BookOpen className="w-5 h-5" />
                      View the Paper
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-12">
        <div className="container">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground font-mono">
              Claude The Halucinate Terminal - An LLM Experiment
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
