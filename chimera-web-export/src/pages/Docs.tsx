import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Dna, ArrowLeft, Code, BookOpen, Cpu, Download } from "lucide-react";

export default function Docs() {
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

      {/* Documentation Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Documentation
            </Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              Getting Started with Chimera
            </h1>
            <p className="text-gray-400 text-lg">
              Everything you need to know to use Project Chimera
            </p>
          </div>

          <div className="space-y-8">
            {/* Installation */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="w-6 h-6 text-purple-400" />
                  Installation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Install the required dependencies for Project Chimera:
                </p>
                <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-purple-300 overflow-x-auto">
                  <pre>{`# Install dependencies
pip install qiskit qiskit-ibm-runtime qiskit-aer openai

# Clone the repository
git clone https://github.com/your-org/project-chimera
cd project-chimera`}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-6 h-6 text-purple-400" />
                  Quick Start (Simulator Mode)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Run Project Chimera in simulator mode without requiring quantum hardware access:
                </p>
                <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-purple-300 overflow-x-auto">
                  <pre>{`from chimera import ChimeraGA

# Create the genetic algorithm
chimera = ChimeraGA(
    num_qubits=2,
    population_size=20,
    max_circuit_depth=10,
    use_ai_guidance=True
)

# Evolve circuits
best_circuit = chimera.evolve(num_generations=50)

# Display result
print(best_circuit.to_circuit())`}</pre>
                </div>
              </CardContent>
            </Card>

            {/* IBM Quantum */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-purple-400" />
                  IBM Quantum Hardware Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  To use real quantum hardware, set your IBM Quantum API token:
                </p>
                <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-purple-300 overflow-x-auto">
                  <pre>{`# Set your IBM Quantum API token
export IBM_QUANTUM_TOKEN='your_token_here'

# Run with hardware integration
python3 chimera_ibm.py`}</pre>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-purple-400">Note:</strong> Get your free IBM Quantum API token at{" "}
                    <a href="https://quantum.cloud.ibm.com" className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      quantum.cloud.ibm.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Architecture */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                  Architecture Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">
                  Project Chimera consists of three main components:
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">1. Genetic Algorithm Engine</h4>
                    <p className="text-gray-300 text-sm">
                      Manages population initialization, selection, crossover, and mutation operations. Chromosomes represent quantum circuits as sequences of genes (quantum gates).
                    </p>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">2. Quantum Hardware Integration</h4>
                    <p className="text-gray-300 text-sm">
                      Executes circuits on IBM Quantum Platform or local simulator. Measures fidelity and performance to calculate fitness scores.
                    </p>
                  </div>
                  <div className="bg-slate-950/30 rounded-lg p-4">
                    <h4 className="text-purple-400 font-semibold mb-2">3. AI Guidance Layer</h4>
                    <p className="text-gray-300 text-sm">
                      Uses GPT-4 to analyze evolution progress every 10 generations and suggest strategic improvements to accelerate convergence.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parameters */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white">Configuration Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-900/30">
                        <th className="text-left py-3 px-4 text-purple-400">Parameter</th>
                        <th className="text-left py-3 px-4 text-purple-400">Default</th>
                        <th className="text-left py-3 px-4 text-purple-400">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-purple-900/20">
                        <td className="py-3 px-4 font-mono text-purple-300">num_qubits</td>
                        <td className="py-3 px-4">2</td>
                        <td className="py-3 px-4">Number of qubits in circuits</td>
                      </tr>
                      <tr className="border-b border-purple-900/20">
                        <td className="py-3 px-4 font-mono text-purple-300">population_size</td>
                        <td className="py-3 px-4">20</td>
                        <td className="py-3 px-4">Number of circuits per generation</td>
                      </tr>
                      <tr className="border-b border-purple-900/20">
                        <td className="py-3 px-4 font-mono text-purple-300">max_circuit_depth</td>
                        <td className="py-3 px-4">10</td>
                        <td className="py-3 px-4">Maximum gates per circuit</td>
                      </tr>
                      <tr className="border-b border-purple-900/20">
                        <td className="py-3 px-4 font-mono text-purple-300">mutation_rate</td>
                        <td className="py-3 px-4">0.3</td>
                        <td className="py-3 px-4">Probability of mutation</td>
                      </tr>
                      <tr className="border-b border-purple-900/20">
                        <td className="py-3 px-4 font-mono text-purple-300">crossover_rate</td>
                        <td className="py-3 px-4">0.7</td>
                        <td className="py-3 px-4">Probability of crossover</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-purple-300">use_ai_guidance</td>
                        <td className="py-3 px-4">True</td>
                        <td className="py-3 px-4">Enable AI-guided evolution</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Example Output */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white">Example Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-950/50 rounded-lg p-4 font-mono text-sm text-purple-300 overflow-x-auto">
                  <pre>{`Generation 0: Best Fitness = 0.4900
Generation 10: Best Fitness = 0.4900 [AI Guidance]
Generation 20: Best Fitness = 0.7900 [AI Guidance]
Generation 30: Best Fitness = 0.8700 [AI Guidance]
Generation 40: Best Fitness = 0.8700 [AI Guidance]
Generation 43: Best Fitness = 0.9700 ✓ Target Reached!

Best Circuit Found:
     ┌───┐┌────────────┐     
q_0: ┤ H ├┤ Rx(2.0204) ├──■──
     └───┘└────────────┘┌─┴─┐
q_1: ────────────────────┤ X ├
                        └───┘

Final Fitness: 0.9700
Circuit Depth: 3
Total Generations: 43`}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-slate-900/50 border-purple-900/30">
              <CardHeader>
                <CardTitle className="text-white">Additional Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <a href="https://github.com" className="text-purple-400 hover:underline font-semibold">GitHub Repository</a>
                      <p className="text-sm text-gray-400">Full source code and examples</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <a href="https://quantum.cloud.ibm.com" className="text-purple-400 hover:underline font-semibold">IBM Quantum Platform</a>
                      <p className="text-sm text-gray-400">Get free quantum computing access</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <Link href="/about" className="text-purple-400 hover:underline font-semibold">
                      Research Paper
                    </Link>
                    <p className="text-sm text-gray-400">Technical details and validation results</p>
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

