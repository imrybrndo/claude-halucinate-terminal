import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Brain, AlertTriangle, Shield, Zap, ChevronRight, Github } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Home() {
    // The userAuth hooks provides authentication state
    // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
    let { user, loading, error, isAuthenticated, logout } = useAuth();

    const [glitchText, setGlitchText] = useState("MIRAGE");

    useEffect(() => {
        const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        const originalText = "MIRAGE";
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
        <div className="min-h-screen bg-gradient-to-b from-[#0B0015] to-[#000000]">

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur">
                <div className="container">
                    <div className="flex items-center justify-between py-4">
                        <Link href="/home">
                            <a className="inline-flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-[#00E5FF]" />
                                <span className="font-mono font-semibold tracking-wide">CLAUDE MIRAGE</span>
                            </a>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                            <Link href="/terminal">
                                <a className="hover:text-primary transition-colors">Terminal</a>
                            </Link>
                            <Link href="/docs">
                                <a className="hover:text-primary transition-colors">Docs</a>
                            </Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                            <Link href="/terminal">
                                <Button size="sm" className="gap-2 font-mono">
                                    <Terminal className="w-4 h-4" />
                                    Launch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(106,0,255,0.08)] via-[rgba(91,55,255,0.06)] to-[rgba(0,229,255,0.05)]" />
                {/* Astral background layers */}
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
                {/* Bottom shadow overlay to connect with next section */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 md:h-28 lg:h-32 bg-gradient-to-b from-transparent via-black/40 to-black" />
                <div className="container relative py-20 md:py-32 lg:py-40">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(106,0,255,0.10)] border border-[rgba(106,0,255,0.30)]">
                                <Terminal className="w-4 h-4 text-[#00E5FF]" />
                                <span className="text-sm text-[#00E5FF] font-mono">LLM Experiment</span>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                                    <span className="text-foreground">CLAUDE</span>
                                    <br />
                                    <span
                                        className="font-mono glitch-text bg-gradient-to-r from-[#6A00FF] via-[#5B37FF] to-[#00E5FF] bg-clip-text text-transparent"
                                        style={{ textShadow: "0 0 12px rgba(0,229,255,0.5), 0 0 6px rgba(106,0,255,0.3)" }}
                                    >
                                        {glitchText}
                                    </span>
                                </h1>
                                <div className="mx-auto h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />

                                <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                                    Enter the Mirage. Where Claude hallucinates truth.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/terminal">
                                    <Button size="lg" className="gap-2 font-mono">
                                        Launch Terminal
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href="/docs">
                                    <Button size="lg" variant="outline" className="gap-2 font-mono">
                                        <Brain className="w-4 h-4" />
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terminal Introduction Section */}
            <section className="py-20 bg-card/50 -mt-10 md:-mt-16">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative order-2 lg:order-1">
                            <img
                                src="/terminal_screen.png"
                                alt="Terminal Screen"
                                className="rounded-lg border border-border shadow-xl"
                            />
                        </div>

                        <div className="space-y-6 order-1 lg:order-2">
                            <Badge variant="outline" className="gap-2">
                                <AlertTriangle className="w-3 h-3" />
                                Understanding AI Limitations
                            </Badge>

                            <h2 className="text-4xl font-bold">
                                What are LLM Hallucinations?
                            </h2>
                            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full md:mx-0 mx-auto" />

                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    Large Language Models (LLMs) like Claude are powerful tools capable of generating human-like text. However, they can sometimes produce outputs that are plausible but factually incorrect or nonsensical. This phenomenon is known as <strong className="text-foreground">hallucination</strong>.
                                </p>

                                <p>
                                    Hallucinations can range from subtle inaccuracies to completely fabricated information. They represent a significant challenge in the development of reliable and trustworthy AI systems. Understanding and mitigating hallucinations is a key area of research in the field of artificial intelligence.
                                </p>
                            </div>

                            <div className="pt-4">
                                <Link href="/terminal">
                                    <Button variant="outline" className="gap-2 font-mono">
                                        <Terminal className="w-4 h-4" />
                                        Try the Experiment
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hallucination Types Section */}
            <section className="py-20">
                <div className="container">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-4xl font-bold">Types of Hallucinations</h2>
                        <div className="mx-auto h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Hallucinations can manifest in several ways. Here are some common types you might encounter in the terminal.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-destructive/30 bg-destructive/5">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-destructive" />
                                        Factual Inaccuracy
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    The model provides information that is demonstrably false or contradicts established facts.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-accent/30 bg-accent/5">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-accent" />
                                        Contextual Inconsistency
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    The model's output contradicts the provided context or its own previous statements.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-secondary/30 bg-secondary/5">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Brain className="w-5 h-5 text-secondary" />
                                        Nonsensical Output
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    The model generates text that is grammatically correct but meaningless or absurd.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-primary/30 bg-primary/5">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Terminal className="w-5 h-5 text-primary" />
                                        Source Fabrication
                                    </CardTitle>
                                </div>
                                <CardDescription>
                                    The model invents sources or citations to support its claims without any factual basis.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Mitigation Strategies Section */}
            <section className="py-20 bg-card/50">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <Badge variant="outline" className="gap-2">
                                <Shield className="w-3 h-3" />
                                Research-Backed Solutions
                            </Badge>

                            <h2 className="text-4xl font-bold">
                                Mitigation Strategies
                            </h2>
                            <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full md:mx-0 mx-auto" />

                            <p className="text-muted-foreground">
                                Researchers and developers are actively working on techniques to reduce LLM hallucinations. The Claude team at Anthropic recommends several strategies:
                            </p>

                            <div className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Allowing Uncertainty</CardTitle>
                                        <CardDescription>
                                            Explicitly permitting the model to state "I don't know" when it lacks information.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Grounded Responses</CardTitle>
                                        <CardDescription>
                                            Instructing the model to base its answers on provided text and to use direct quotes.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Chain-of-Thought Verification</CardTitle>
                                        <CardDescription>
                                            Asking the model to explain its reasoning process step-by-step.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full" />
                            <img
                                src="/hallucination_visualization.png"
                                alt="Hallucination Visualization"
                                className="relative rounded-lg border border-border shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container">
                    <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10">
                        <CardContent className="p-12">
                            <div className="text-center space-y-6 max-w-2xl mx-auto">
                                <h2 className="text-4xl font-bold">
                                    Ready to Explore?
                                </h2>
                                <div className="mx-auto h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-full" />
                                <p className="text-muted-foreground text-lg">
                                    Launch the terminal and begin your investigation into the fascinating and complex world of LLM hallucinations.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center pt-4">
                                    <Link href="/terminal">
                                        <Button size="lg" className="gap-2 font-mono">
                                            <Terminal className="w-5 h-5" />
                                            Launch Experiment
                                        </Button>
                                    </Link>
                                    <Link href="/docs">
                                        <Button size="lg" variant="outline" className="gap-2 font-mono">
                                            View Documentation
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-border">
                <div className="container">
                    <div className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground font-mono">
                            Claude The Halucinate Terminal - An LLM Experiment
                        </p>
                        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                            <Link href="/docs">
                                <a className="hover:text-primary transition-colors">Documentation</a>
                            </Link>
                            <a href="https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Research</a>
                            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
