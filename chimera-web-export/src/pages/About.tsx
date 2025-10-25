import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Dna, ArrowLeft, Target, Zap, TrendingUp, Users } from "lucide-react";

export default function About() {
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
            <Link href="/">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* About Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              About Project Chimera
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              The Future of Quantum Computing
            </h1>
            <p className="text-gray-400 text-lg">
              Democratizing quantum algorithm design through AI-guided evolution
            </p>
          </div>

          <div className="space-y-8">
            {/* Mission */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Project Chimera was created to solve one of quantum computing's biggest challenges: the scarcity of skilled quantum algorithm designers. While quantum hardware continues to advance rapidly, the ability to design effective quantum algorithms remains limited to a small group of experts.
                </p>
                <p>
                  Our mission is to democratize quantum computing by automating the algorithm design process. By combining genetic algorithms with AI guidance and real quantum hardware feedback, we enable researchers and developers to discover optimal quantum circuits without requiring deep expertise in quantum mechanics.
                </p>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-400" />
                  The Innovation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Project Chimera represents a unique convergence of three powerful technologies:
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">Genetic Algorithms</h4>
                    <p className="text-sm">
                      Inspired by natural evolution, our genetic algorithm treats quantum circuits as chromosomes that evolve over generations. Through selection, crossover, and mutation, the system discovers increasingly optimal circuit designs.
                    </p>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">Real Quantum Hardware</h4>
                    <p className="text-sm">
                      Unlike purely theoretical approaches, Chimera evaluates circuits on actual quantum computers via IBM Quantum Platform. This real-world feedback ensures discovered algorithms work on physical hardware, not just in simulation.
                    </p>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">AI Guidance</h4>
                    <p className="text-sm">
                      Large language models analyze evolution progress and suggest strategic improvements. This AI layer accelerates convergence by steering the search toward promising regions of the solution space.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  Proven Results
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  In validation testing, Project Chimera successfully evolved a quantum circuit to create a Bell state with 97% fidelity in just 43 generations. The system autonomously discovered the correct gate combination (Hadamard + CNOT + rotation) through evolutionary search, demonstrating the viability of this approach.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-400 mb-2">97%</div>
                    <div className="text-sm text-gray-400">Final fitness score achieved</div>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-400 mb-2">43</div>
                    <div className="text-sm text-gray-400">Generations to convergence</div>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-400 mb-2">3</div>
                    <div className="text-sm text-gray-400">Gates in final circuit</div>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-400 mb-2">71%</div>
                    <div className="text-sm text-gray-400">Test suite pass rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Markets */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  Who Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  Project Chimera is designed to serve multiple industries and use cases:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold">Pharmaceutical & Healthcare</h4>
                      <p className="text-sm text-gray-400">Drug discovery, molecular simulation, and personalized medicine applications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold">Financial Services</h4>
                      <p className="text-sm text-gray-400">Portfolio optimization, risk analysis, and fraud detection algorithms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold">Research Institutions</h4>
                      <p className="text-sm text-gray-400">Academic quantum computing research and algorithm development</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-semibold">Technology Companies</h4>
                      <p className="text-sm text-gray-400">Quantum application development and optimization services</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Vision */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold text-white mb-4">The Road Ahead</h3>
                <p className="text-gray-300 mb-6">
                  Project Chimera is just the beginning. Our roadmap includes expanding to support additional quantum platforms, implementing advanced genetic operators, optimizing for quantum machine learning circuits, and developing a full SaaS platform for commercial deployment.
                </p>
                <p className="text-gray-300">
                  The quantum computing market is projected to reach $65 billion by 2030. By making quantum algorithm design accessible to a broader audience, Project Chimera aims to accelerate the adoption of quantum computing across industries and unlock new possibilities in computation.
                </p>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center pt-8">
              <h3 className="text-2xl font-bold text-white mb-4">Join the Quantum Revolution</h3>
              <div className="flex gap-4 justify-center">
                <Link href="/demo">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                    <span>Try the Demo</span>
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" asChild>
                    <span>Read Documentation</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 bg-slate-950/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p className="mb-2">© 2025 Project Chimera</p>
          <p className="text-xs">
            Powered by{" "}
            <a href="https://ai4utech.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
              AI4Utech.com
            </a>
            {" "}• Quantum Computing by IBM
          </p>
        </div>
      </footer>
    </div>
  );
}

