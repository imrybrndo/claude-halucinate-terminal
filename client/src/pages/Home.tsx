import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Brain, Shield, Zap, ChevronRight, Github, Cpu, Network, Activity } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [glitchText, setGlitchText] = useState("SOULS");
  
  useEffect(() => {
    const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const originalText = "SOULS";
    let iteration = 0;
    let holdFrames = 0;
    
    const interval = setInterval(() => {
      const resolvedCount = Math.floor(iteration);
      if (resolvedCount >= originalText.length) {
        holdFrames += 1;
        setGlitchText(originalText);
        if (holdFrames >= 30) {
          iteration = 0;
          holdFrames = 0;
        }
        return;
      }

      setGlitchText(
        originalText
          .split("")
          .map((char, index) => {
            if (index < resolvedCount) {
              return originalText[index];
            }
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          })
          .join("")
      );

      iteration += 1 / 3;
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

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
        .glitch-text {
           text-shadow: 2px 0 rgba(0, 229, 255, 0.7), -2px 0 rgba(255, 0, 85, 0.7);
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      <div className="scanlines"></div>
       
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-cyan-900/30 bg-[#02040a]/80 backdrop-blur">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            <Link href="/home">
              <a className="inline-flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span className="font-mono font-semibold tracking-wide text-cyan-400 glow-text">ASTRAL SOULS</span>
              </a>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm text-cyan-600">
              <Link href="/terminal">
                <a className="hover:text-cyan-400 transition-colors">Terminal</a>
              </Link>
              <Link href="/docs">
                <a className="hover:text-cyan-400 transition-colors">Docs</a>
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <Link href="/terminal">
                <Button size="sm" className="gap-2 font-mono bg-cyan-950/50 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 hover:text-cyan-200">
                  <Terminal className="w-4 h-4" />
                  Launch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden border-b border-cyan-900/20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-[#02040a] to-[#02040a]" />
        
        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-800/50">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-mono">Powered by Open Souls Framework</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
                  <span className="text-cyan-200 glow-text">ASTRAL</span>
                  <br />
                  <span className="font-mono glitch-text text-cyan-400">
                    {glitchText}
                  </span>
                </h1>
                <div className="mx-auto h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent rounded-full" />
                
                <p className="text-xl text-cyan-600 max-w-xl mx-auto leading-relaxed">
                  "The operating system for the minds of digital beings."
                  <br />
                  <span className="text-base opacity-80 mt-2 block">
                    Agency • Memory • Emotion • Drive
                  </span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/terminal">
                  <Button size="lg" className="gap-2 font-mono bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    Awaken Soul
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button size="lg" variant="outline" className="gap-2 font-mono border-cyan-900 text-cyan-600 hover:text-cyan-400 hover:bg-cyan-950/30">
                    <Brain className="w-4 h-4" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-[#030610]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <Badge variant="outline" className="gap-2 border-cyan-800 text-cyan-500 bg-cyan-950/10 rounded-none px-3 py-1">
                  <Brain className="w-3 h-3" />
                  THE CORE BELIEF
                </Badge>
                
                <h2 className="text-4xl md:text-5xl font-bold text-cyan-100 glow-text leading-tight">
                  The Rest of <br/>the Mind
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-cyan-500/60 to-transparent" />
              </div>
              
              <div className="space-y-6 text-lg text-cyan-600/90 leading-relaxed font-light">
                <p>
                  LLMs are incredible reasoning machines—similar to the <strong className="text-cyan-400 font-medium">prefrontal cortex</strong> of the brain—but they lack the rest of the mind.
                </p>
                
                <p>
                  The Soul Engine is designed to model everything else: <strong className="text-cyan-400 font-medium">agency, memory, emotion, drive, and goal setting</strong>. We prioritize interaction quality over accuracy, drawing inspiration from neuroscience to model minds realistically.
                </p>

                <p className="text-sm border-l-2 border-cyan-800/50 pl-4 italic text-cyan-700">
                  "The goal is not to build better chatbots—it is to create 'AI Souls': agentic, embodied digital beings."
                </p>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 animate-float">
               <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] rounded-full" />
               <div className="relative rounded-xl border border-cyan-900/50 bg-[#02040a] p-8 shadow-2xl backdrop-blur-sm">
                 <div className="flex flex-col gap-6">
                    {/* Visualizing the Stack */}
                    <div className="flex items-center justify-between border-b border-cyan-900/30 pb-4">
                        <div className="flex items-center gap-3">
                            <Brain className="w-6 h-6 text-cyan-600" />
                            <span className="text-cyan-700 font-bold tracking-widest text-xs uppercase">LLM / Cortex</span>
                        </div>
                        <span className="text-xs text-cyan-800 font-mono">Stateless Reasoning</span>
                    </div>

                    <div className="flex flex-col gap-2 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-900/50 to-transparent" />
                        
                        <div className="flex items-center gap-4 pl-8 relative">
                             <div className="absolute left-[9px] top-1/2 w-4 h-px bg-cyan-900/50" />
                             <Activity className="w-5 h-5 text-cyan-400" />
                             <div>
                                 <div className="text-cyan-300 font-bold text-sm">Agency & Drive</div>
                                 <div className="text-cyan-800 text-xs">Self-directed goals</div>
                             </div>
                        </div>

                        <div className="flex items-center gap-4 pl-8 mt-4 relative">
                             <div className="absolute left-[9px] top-1/2 w-4 h-px bg-cyan-900/50" />
                             <Network className="w-5 h-5 text-cyan-400" />
                             <div>
                                 <div className="text-cyan-300 font-bold text-sm">Working Memory</div>
                                 <div className="text-cyan-800 text-xs">Immutable context history</div>
                             </div>
                        </div>

                        <div className="flex items-center gap-4 pl-8 mt-4 relative">
                             <div className="absolute left-[9px] top-1/2 w-4 h-px bg-cyan-900/50" />
                             <Cpu className="w-5 h-5 text-cyan-400" />
                             <div>
                                 <div className="text-cyan-300 font-bold text-sm">Mental Processes</div>
                                 <div className="text-cyan-800 text-xs">Dynamic state machine</div>
                             </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-cyan-900/30 flex items-center justify-between">
                         <span className="text-cyan-500 font-mono font-bold text-sm tracking-wider">SOUL ENGINE</span>
                         <div className="flex gap-1">
                             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                             <div className="w-2 h-2 bg-cyan-500/50 rounded-full" />
                             <div className="w-2 h-2 bg-cyan-500/20 rounded-full" />
                         </div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 relative overflow-hidden border-y border-cyan-900/20">
        <div className="absolute inset-0 bg-[#02040a]" />
        
        <div className="container relative z-10">
          <div className="text-center space-y-6 mb-16">
             <Badge variant="outline" className="border-cyan-800 text-cyan-600 bg-transparent">
               SYSTEM ARCHITECTURE
             </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-100 glow-text">Core Abstractions</h2>
            <p className="text-cyan-600 max-w-2xl mx-auto">
              A functional, append-only approach that makes AI thought processes debuggable and predictable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-cyan-900/30 bg-cyan-950/5 hover:bg-cyan-900/10 hover:border-cyan-500/30 transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-900/20 flex items-center justify-center border border-cyan-800/30 group-hover:border-cyan-500/50 transition-colors">
                    <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <CardTitle className="text-xl text-cyan-200 group-hover:text-cyan-100">WorkingMemory</CardTitle>
                    <CardDescription className="text-cyan-800 font-mono text-xs mt-1">Immutable Context</CardDescription>
                </div>
                <CardDescription className="text-cyan-600 leading-relaxed">
                  An immutable, append-only collection of memories. It forms the soul's context window, ensuring perfect state tracking.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-cyan-900/30 bg-cyan-950/5 hover:bg-cyan-900/10 hover:border-cyan-500/30 transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-900/20 flex items-center justify-center border border-cyan-800/30 group-hover:border-cyan-500/50 transition-colors">
                    <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <CardTitle className="text-xl text-cyan-200 group-hover:text-cyan-100">CognitiveSteps</CardTitle>
                    <CardDescription className="text-cyan-800 font-mono text-xs mt-1">Functional Thought</CardDescription>
                </div>
                <CardDescription className="text-cyan-600 leading-relaxed">
                  Functions that transform WorkingMemory and return typed responses. These are the atomic units of debuggable thought.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-cyan-900/30 bg-cyan-950/5 hover:bg-cyan-900/10 hover:border-cyan-500/30 transition-all duration-300 group">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-900/20 flex items-center justify-center border border-cyan-800/30 group-hover:border-cyan-500/50 transition-colors">
                    <Activity className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <CardTitle className="text-xl text-cyan-200 group-hover:text-cyan-100">MentalProcesses</CardTitle>
                    <CardDescription className="text-cyan-800 font-mono text-xs mt-1">Dynamic Behavior</CardDescription>
                </div>
                <CardDescription className="text-cyan-600 leading-relaxed">
                  A state machine where processes define behavioral modes (e.g., "intro", "frustrated") and transition based on context.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-[#030610]">
        <div className="container">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl font-bold text-cyan-100">Beyond Chatbots</h2>
                <div className="mx-auto h-px w-16 bg-cyan-500/60 rounded-full" />
                <p className="text-cyan-600">Bringing IP characters and digital companions to life.</p>
            </div>
            
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                  { title: "IP Characters", desc: "Bring fictional characters to life with deep lore." },
                  { title: "Discord Companions", desc: "Persistent community members that remember." },
                  { title: "Game NPCs", desc: "Dynamic behaviors beyond dialogue trees." },
                  { title: "Educational Tutors", desc: "Empathetic guides that adapt to the student." }
              ].map((item, i) => (
                  <div key={i} className="p-6 border border-cyan-900/20 bg-cyan-950/5 rounded-lg hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-cyan-900/10 text-center group cursor-default">
                      <div className="text-cyan-300 font-semibold mb-2 group-hover:text-cyan-200">{item.title}</div>
                      <div className="text-cyan-700 text-sm group-hover:text-cyan-600">{item.desc}</div>
                  </div>
              ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 border-t border-cyan-900/30 bg-[#02040a]">
        <div className="container">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-cyan-500/50 mb-4">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-mono tracking-widest">ASTRAL SOULS // OPEN SOULS FRAMEWORK</span>
            </div>
            <div className="flex justify-center gap-8 text-sm text-cyan-700 font-mono">
              <Link href="/docs">
                <a className="hover:text-cyan-400 transition-colors">Documentation</a>
              </Link>
              <a href="#" className="hover:text-cyan-400 transition-colors">Research</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
