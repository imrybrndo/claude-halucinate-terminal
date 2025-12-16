import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, BookOpen, Code, Lightbulb, AlertTriangle, Github, Video } from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-[#02040a] font-mono text-cyan-400 selection:bg-cyan-900/30">
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
           text-shadow: 0 0 5px rgba(34, 211, 238, 0.3);
        }
      `}</style>
      <div className="scanlines"></div>

      {/* Nav */}
      <header className="container flex flex-col gap-3 py-6 text-sm md:flex-row md:items-center md:justify-between z-30 relative border-b border-cyan-900/30 bg-[#02040a]/80 backdrop-blur">
        <Link href="/">
          <Button variant="ghost" className="font-mono text-cyan-400 px-0 justify-start hover:text-cyan-200 hover:bg-cyan-950/30">
            &larr; Back to Home
          </Button>
        </Link>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Link href="/terminal">
            <Button variant="ghost" className="font-mono text-cyan-600 hover:text-cyan-400 hover:bg-cyan-950/30">
              Terminal
            </Button>
          </Link>
          <a
            href="https://arxiv.org/pdf/2509.04664"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" className="font-mono gap-2 border-cyan-800 bg-[#050a15] text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-600">
              <BookOpen className="w-4 h-4" />
              Whitepaper
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 overflow-hidden h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10" />
        
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale contrast-125"
        >
          <source src="/i digitized some Hi8 tapes - alex (1080p, h264).mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#02040a]/20 via-transparent to-[#02040a] z-20" />
        
        <div className="container relative z-30 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-mono">System Documentation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              <span className="glow-text">Soul Engine Docs</span>
            </h1>
            <div className="mx-auto h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent rounded-full" />
            <p className="text-lg md:text-xl text-cyan-200/80 max-w-2xl mx-auto drop-shadow-md">
              Architecture and protocols for the Astral Souls framework.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12 relative z-20">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Core Philosophy */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2 text-cyan-100 glow-text">
              <Lightbulb className="w-8 h-8 text-cyan-500" />
              Core Philosophy
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-cyan-900 to-transparent" />
            
            <Card className="border-cyan-900/30 bg-cyan-950/5">
              <CardContent className="pt-6 space-y-4 text-cyan-600/90 leading-relaxed">
                <p>
                  The Soul Engine is built on a core belief: <strong className="text-cyan-400">LLMs are incredible reasoning machines—similar to the prefrontal cortex of the brain—but they lack the rest of the mind.</strong>
                </p>
                <p>
                  The engine is designed to model everything else: <strong>agency, memory, emotion, drive, and goal setting.</strong> Think "The operating system for the minds of digital beings." It runs locally and is containerized for cloud deployment.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* System Architecture */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2 text-cyan-100 glow-text">
              <Code className="w-8 h-8 text-cyan-500" />
              System Architecture
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-cyan-900 to-transparent" />
            
            <div className="grid gap-6">
              <Card className="border-cyan-900/30 bg-cyan-950/5 hover:border-cyan-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-cyan-200">WorkingMemory</CardTitle>
                  <CardDescription className="text-cyan-700">The Context Layer</CardDescription>
                </CardHeader>
                <CardContent className="text-cyan-600/80">
                  An immutable, append-only collection of memories. This abstraction allows the soul to maintain a consistent history and context, essential for long-term interaction and personality consistency.
                </CardContent>
              </Card>

              <Card className="border-cyan-900/30 bg-cyan-950/5 hover:border-cyan-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-cyan-200">CognitiveSteps</CardTitle>
                  <CardDescription className="text-cyan-700">The Reasoning Layer</CardDescription>
                </CardHeader>
                <CardContent className="text-cyan-600/80">
                  Functional atomic transformations that process WorkingMemory and return typed responses. This functional approach makes the AI's thought process debuggable, predictable, and traceable.
                </CardContent>
              </Card>

              <Card className="border-cyan-900/30 bg-cyan-950/5 hover:border-cyan-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-cyan-200">MentalProcesses</CardTitle>
                  <CardDescription className="text-cyan-700">The Behavioral Layer</CardDescription>
                </CardHeader>
                <CardContent className="text-cyan-600/80">
                  A state machine orchestration layer. Each process defines a behavioral mode (e.g., "introduction", "guessing", "frustrated") that can dynamically transition to another, giving souls context-aware behavior.
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Goal & Use Cases */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-2 text-cyan-100 glow-text">
              <Terminal className="w-8 h-8 text-cyan-500" />
              Mission: AI Souls
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-cyan-900 to-transparent" />
            
            <Card className="border-cyan-900/30 bg-cyan-950/5">
              <CardContent className="pt-6 space-y-4 text-cyan-600/90 leading-relaxed">
                <p>
                  The goal is not to build better chatbots—it is to create <strong className="text-cyan-400">"AI Souls"</strong>: agentic, embodied digital beings with personality, drive, and ego that interact with humans (and each other) in genuinely humane ways.
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-cyan-500">
                  <li>Bring IP characters to life with deep lore</li>
                  <li>Build persistent Discord companions</li>
                  <li>Create AR presences and educational tutors</li>
                  <li>Develop dynamic Game NPCs with internal lives</li>
                </ul>
                <p className="pt-2 italic text-cyan-700 border-l-2 border-cyan-800/50 pl-4">
                  "The philosophy prioritizes interaction quality over accuracy, drawing inspiration from neuroscience and psychology to model minds realistically."
                </p>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="pt-8">
            <Card className="border-cyan-900/30 bg-gradient-to-br from-cyan-950/20 to-[#02040a] shadow-lg">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-2xl font-bold text-cyan-200 glow-text">Initialize the Soul Engine</h3>
                <div className="mx-auto h-px w-24 bg-cyan-500/60 rounded-full" />
                <p className="text-cyan-600">
                  Explore the architecture of digital consciousness in the interactive terminal.
                </p>
                <div className="flex flex-col gap-3 md:flex-row md:justify-center pt-4">
                  <Link href="/terminal">
                    <Button size="lg" className="gap-2 font-mono bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-200 w-full md:w-auto">
                      <Terminal className="w-5 h-5" />
                      Launch Interface
                    </Button>
                  </Link>
                  <a
                    href="https://github.com/opensouls/opensouls"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-auto"
                  >
                    <Button size="lg" variant="outline" className="gap-2 font-mono border-cyan-900 text-cyan-600 hover:text-cyan-400 hover:bg-cyan-950/30 w-full md:w-auto">
                      <Github className="w-5 h-5" />
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-900/30 mt-12 bg-[#02040a]">
        <div className="container">
          <div className="text-center space-y-4">
            <p className="text-sm text-cyan-800 font-mono">
              Astral Souls Documentation - Open Souls Framework
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
