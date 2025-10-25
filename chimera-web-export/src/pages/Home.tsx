import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Dna, Cpu, Sparkles, TrendingUp, ArrowRight, Github, BookOpen, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-purple-900/20 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dna className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Project Chimera</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-gray-300 hover:text-purple-400 transition-colors">
                Documentation
              </Link>
              <Link href="/demo" className="text-gray-300 hover:text-purple-400 transition-colors">
                Live Demo
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-purple-400 transition-colors">
                About
              </Link>
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 relative overflow-hidden">
        {/* Background tech overlay */}
        <div className="absolute inset-0 opacity-10">
          <img src="/futuristic-ui.jpg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm px-4 py-1">
              Self-Evolving Quantum AI Architect • Powered by IBM Quantum
            </Badge>
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Automating Quantum
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Algorithm Design
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Project Chimera uses genetic algorithms and AI guidance to autonomously design and optimize quantum circuits on IBM Quantum Platform. Achieved <span className="text-purple-400 font-semibold">97% fitness</span> in evolving Bell state circuits.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white gap-2" asChild>
                  <span>
                    <Play className="w-5 h-5" />
                    Try Live Demo
                  </span>
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white gap-2">
                <BookOpen className="w-5 h-5" />
                Read Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">97%</div>
              <div className="text-gray-400">Fitness Score</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">43</div>
              <div className="text-gray-400">Generations</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">71%</div>
              <div className="text-gray-400">Test Pass Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">$65B</div>
              <div className="text-gray-400">Market by 2030</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg">Three powerful technologies working together</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm hover:border-purple-500/50 transition-all overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img src="/quantum-circuit.jpg" alt="Quantum Circuit" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <CardHeader>
              <Dna className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Genetic Algorithms</CardTitle>
              <CardDescription className="text-gray-400">
                Evolves quantum circuits through natural selection. Chromosomes represent circuits, genes represent quantum gates.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm">
              Population initialization, tournament selection, crossover, and mutation operators create successive generations of optimized circuits.
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm hover:border-purple-500/50 transition-all overflow-hidden group">
            <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-6xl font-bold text-purple-400 mb-2">127</div>
                <div className="text-sm text-gray-300">Qubits • IBM Brisbane</div>
                <div className="text-xs text-gray-400 mt-2">Eagle r3 Processor</div>
              </div>
            </div>
            <CardHeader>
              <Cpu className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">IBM Quantum Hardware</CardTitle>
              <CardDescription className="text-gray-400">
                Real-time feedback from IBM Quantum Platform provides accurate fitness evaluation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm">
              Circuits execute on actual quantum computers (ibm_brisbane, ibm_torino), measuring fidelity and performance on real hardware.
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm hover:border-purple-500/50 transition-all overflow-hidden group">
            <div className="h-48 overflow-hidden">
              <img src="/neural-network.png" alt="AI Neural Network" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 bg-white" />
            </div>
            <CardHeader>
              <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">AI Guidance</CardTitle>
              <CardDescription className="text-gray-400">
                GPT-4 analyzes evolution progress and suggests strategic improvements.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm">
              Every 10 generations, AI examines population fitness and circuit structures to guide the search toward optimal solutions.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-12 border border-purple-500/30">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Proven Results</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                In validation tests, Project Chimera successfully evolved a quantum circuit to create a Bell state with 97% fidelity in just 43 generations. The system autonomously discovered the correct gate combination (Hadamard + CNOT) through evolutionary search.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Target: Bell State |Φ+⟩ = (|00⟩ + |11⟩)/√2</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Final Circuit Depth: 3 gates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">AI Guidance: 4 strategic interventions</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-8 border border-purple-500/20">
              <div className="text-sm text-gray-400 mb-4 font-mono">Best Circuit Found:</div>
              <pre className="text-purple-300 font-mono text-sm overflow-x-auto">
{`     ┌───┐┌────────────┐     
q_0: ┤ H ├┤ Rx(2.0204) ├──■──
     └───┘└────────────┘┌─┴─┐
q_1: ───────────────────┤ X ├
                        └───┘`}
              </pre>
              <div className="mt-4 text-sm text-gray-400">
                <span className="text-purple-400 font-semibold">Fitness:</span> 0.9700 (97%)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Market Opportunity</h2>
          <p className="text-gray-400 text-lg">Solving quantum computing's biggest bottleneck</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Revenue Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <div className="flex justify-between items-center">
                <span>Starter Plan</span>
                <span className="text-purple-400 font-semibold">$99/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Professional Plan</span>
                <span className="text-purple-400 font-semibold">$499/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Enterprise Plan</span>
                <span className="text-purple-400 font-semibold">Custom</span>
              </div>
              <div className="pt-4 border-t border-purple-900/30 text-sm text-gray-400">
                + Compute credits for quantum hardware time
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-900/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Projections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-300">
              <div className="flex justify-between items-center">
                <span>Year 1</span>
                <span className="text-purple-400 font-semibold">$500K</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Year 3</span>
                <span className="text-purple-400 font-semibold">$10M</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Year 5</span>
                <span className="text-purple-400 font-semibold">$50M</span>
              </div>
              <div className="pt-4 border-t border-purple-900/30 text-sm text-gray-400">
                Based on conservative market penetration
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Explore the documentation, try the live demo, or dive into the source code on GitHub.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/demo">
              <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-gray-100 border-0 gap-2" asChild>
                <span>
                  <Play className="w-5 h-5" />
                  Live Demo
                </span>
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 gap-2">
              <Github className="w-5 h-5" />
              View on GitHub
            </Button>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 gap-2" asChild>
                <span>
                  <BookOpen className="w-5 h-5" />
                  Documentation
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dna className="w-6 h-6 text-purple-400" />
                <span className="font-bold text-white">Project Chimera</span>
              </div>
              <p className="text-gray-400 text-sm">
                Automating quantum algorithm design through AI-guided evolution.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/demo" className="hover:text-purple-400 transition-colors">Live Demo</Link></li>
                <li><Link href="/docs" className="hover:text-purple-400 transition-colors">Documentation</Link></li>
                <li><Link href="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-purple-400 transition-colors">About</Link></li>
                <li><Link href="/research" className="hover:text-purple-400 transition-colors">Research</Link></li>
                <li><Link href="/blog" className="hover:text-purple-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://github.com" className="hover:text-purple-400 transition-colors">GitHub</a></li>
                <li><a href="https://twitter.com" className="hover:text-purple-400 transition-colors">Twitter</a></li>
                <li><a href="mailto:contact@chimera.ai" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-900/20 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p className="mb-2">© 2025 Project Chimera. Built with quantum precision.</p>
            <p className="text-xs">
              Powered by{" "}
              <a href="https://ai4utech.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
                AI4Utech.com
              </a>
              {" "}• Quantum Computing by IBM
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
