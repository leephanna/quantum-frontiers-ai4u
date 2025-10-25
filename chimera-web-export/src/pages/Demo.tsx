import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Dna, ArrowLeft, Play, Pause, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";

export default function Demo() {
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [bestFitness, setBestFitness] = useState(0.49);
  const [avgFitness, setAvgFitness] = useState(0.19);

  const handleStart = () => {
    setIsRunning(true);
    // Simulate evolution progress
    const interval = setInterval(() => {
      setGeneration(prev => {
        if (prev >= 43) {
          clearInterval(interval);
          setIsRunning(false);
          return 43;
        }
        return prev + 1;
      });
      setBestFitness(prev => Math.min(0.97, prev + Math.random() * 0.02));
      setAvgFitness(prev => Math.min(0.58, prev + Math.random() * 0.01));
    }, 200);
  };

  const handleReset = () => {
    setIsRunning(false);
    setGeneration(0);
    setBestFitness(0.49);
    setAvgFitness(0.19);
  };

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

      {/* Demo Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Interactive Demo
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              Watch Chimera Evolve
            </h1>
            <p className="text-gray-400 text-lg">
              See the genetic algorithm in action as it evolves quantum circuits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-400">{generation}</div>
                <div className="text-sm text-gray-400 mt-2">/ 50 max</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Best Fitness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-400">{bestFitness.toFixed(4)}</div>
                <div className="text-sm text-gray-400 mt-2">Target: 0.9500</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">Avg Fitness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-400">{avgFitness.toFixed(4)}</div>
                <div className="text-sm text-gray-400 mt-2">Population average</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900/50 border-purple-900/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Evolution Progress</CardTitle>
              <CardDescription className="text-gray-400">
                Fitness evolution over generations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950/50 rounded-lg p-6 h-64 flex items-end gap-1">
                {Array.from({ length: 50 }).map((_, i) => {
                  const height = i <= generation 
                    ? Math.min(100, (0.49 + (i / 50) * 0.48) * 100)
                    : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-200"
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-purple-900/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Current Best Circuit</CardTitle>
              <CardDescription className="text-gray-400">
                Quantum circuit representation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-950/50 rounded-lg p-6 font-mono text-sm text-purple-300 overflow-x-auto">
                <pre>
{generation >= 43 ? `     ┌───┐┌────────────┐     
q_0: ┤ H ├┤ Rx(2.0204) ├──■──
     └───┘└────────────┘┌─┴─┐
q_1: ────────────────────┤ X ├
                        └───┘` : `     ┌───┐     
q_0: ┤ H ├─────
     └───┘     
q_1: ──────────
              `}
                </pre>
              </div>
              {generation >= 43 && (
                <div className="mt-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Target reached! Fitness: 0.9700</span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleStart}
              disabled={isRunning || generation >= 43}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Evolution
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>

          <div className="mt-12 bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-3">About This Demo</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              This is a simplified visualization of Project Chimera's evolution process. In the actual system, each generation involves creating a population of quantum circuits, evaluating them on quantum hardware or simulator, selecting the best performers, and breeding the next generation through crossover and mutation. AI guidance analyzes progress every 10 generations to suggest strategic improvements.
            </p>
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

