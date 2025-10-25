/**
 * Job Submission Page - Custom Quantum Circuit Evolution
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Zap, Settings, Target, Cpu, AlertCircle } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function SubmitJob() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Form state
  const [application, setApplication] = useState<string>("custom");
  const [circuitSpec, setCircuitSpec] = useState<string>("");
  const [targetFitness, setTargetFitness] = useState<number>(95);
  const [maxGenerations, setMaxGenerations] = useState<number>(50);
  const [useRealHardware, setUseRealHardware] = useState<boolean>(false);

  // Create job mutation
  const createJob = trpc.orchestrator.createJob.useMutation({
    onSuccess: (data) => {
      setLocation(`/jobs/${data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!circuitSpec.trim()) {
      alert("Please provide a circuit specification");
      return;
    }

    createJob.mutate({
      application: application as any,
      circuitSpec: circuitSpec.trim(),
      targetFitness,
      maxGenerations,
      useRealHardware,
    });
  };

  const predefinedSpecs = {
    bell_state: "Create a Bell state (|Φ+⟩) using 2 qubits with maximum entanglement",
    ghz_state: "Generate a 3-qubit GHZ state with equal superposition",
    qft: "Implement a 3-qubit Quantum Fourier Transform circuit",
    grover: "Design a Grover search circuit for 2-qubit database",
    vqe: "Optimize a variational quantum eigensolver ansatz for H2 molecule",
    qaoa: "Create a QAOA circuit for Max-Cut problem on 4 nodes",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
            Submit Custom Job
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Submit Evolution Job
          </h1>
          <p className="text-xl text-purple-200">
            Design your own quantum circuit optimization with AI-guided evolution
          </p>
        </div>

        {/* Authentication Check */}
        {!isAuthenticated && (
          <Card className="bg-yellow-500/10 border-yellow-500/30 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-yellow-300 font-semibold mb-2">Authentication Required</h3>
                  <p className="text-yellow-200 text-sm mb-3">
                    You need to be logged in to submit custom jobs. Your jobs will be saved and you can track their progress.
                  </p>
                  <a href={getLoginUrl()}>
                    <Button variant="outline" className="border-yellow-500/50 hover:bg-yellow-500/10">
                      Log In to Continue
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Submission Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Job Configuration</CardTitle>
              </div>
              <CardDescription className="text-purple-200">
                Configure your quantum circuit evolution parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Application Type */}
              <div className="space-y-2">
                <Label htmlFor="application" className="text-purple-300">
                  Application Type
                </Label>
                <Select value={application} onValueChange={setApplication}>
                  <SelectTrigger id="application" className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="custom">Custom Circuit</SelectItem>
                    <SelectItem value="drug_discovery">Drug Discovery</SelectItem>
                    <SelectItem value="finance">Financial Optimization</SelectItem>
                    <SelectItem value="materials">Materials Science</SelectItem>
                    <SelectItem value="aerospace">Aerospace Engineering</SelectItem>
                    <SelectItem value="telecom">Telecommunications</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-purple-400">
                  Select the industry application or choose "Custom Circuit" for general-purpose optimization
                </p>
              </div>

              {/* Circuit Specification */}
              <div className="space-y-2">
                <Label htmlFor="circuitSpec" className="text-purple-300">
                  Circuit Specification <span className="text-pink-400">*</span>
                </Label>
                <Textarea
                  id="circuitSpec"
                  value={circuitSpec}
                  onChange={(e) => setCircuitSpec(e.target.value)}
                  placeholder="Describe the quantum circuit you want to optimize... (e.g., 'Create a Bell state using 2 qubits')"
                  className="bg-slate-900/50 border-slate-700 text-white min-h-[120px]"
                  required
                />
                <p className="text-xs text-purple-400">
                  Describe your target circuit in natural language. The AI will guide the evolution toward this goal.
                </p>
              </div>

              {/* Quick Templates */}
              <div className="space-y-2">
                <Label className="text-purple-300">Quick Templates</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(predefinedSpecs).map(([key, spec]) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCircuitSpec(spec)}
                      className="border-purple-500/30 hover:bg-purple-500/10 text-purple-300 justify-start text-left h-auto py-2"
                    >
                      <span className="text-xs">{spec.substring(0, 50)}...</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Target Fitness */}
              <div className="space-y-2">
                <Label htmlFor="targetFitness" className="text-purple-300">
                  Target Fitness (%)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="targetFitness"
                    type="number"
                    min="50"
                    max="100"
                    value={targetFitness}
                    onChange={(e) => setTargetFitness(Number(e.target.value))}
                    className="bg-slate-900/50 border-slate-700 text-white w-32"
                  />
                  <span className="text-white text-lg font-semibold">{targetFitness}%</span>
                </div>
                <p className="text-xs text-purple-400">
                  Evolution will stop when this fitness level is reached (50-100%)
                </p>
              </div>

              {/* Max Generations */}
              <div className="space-y-2">
                <Label htmlFor="maxGenerations" className="text-purple-300">
                  Maximum Generations
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="maxGenerations"
                    type="number"
                    min="10"
                    max="200"
                    value={maxGenerations}
                    onChange={(e) => setMaxGenerations(Number(e.target.value))}
                    className="bg-slate-900/50 border-slate-700 text-white w-32"
                  />
                  <span className="text-white text-lg font-semibold">{maxGenerations} generations</span>
                </div>
                <p className="text-xs text-purple-400">
                  Maximum number of evolution cycles (10-200). More generations = better optimization but longer runtime.
                </p>
              </div>

              {/* Hardware Selection */}
              <div className="space-y-2">
                <Label className="text-purple-300">Execution Environment</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant={!useRealHardware ? "default" : "outline"}
                    onClick={() => setUseRealHardware(false)}
                    className={!useRealHardware ? "bg-purple-500 hover:bg-purple-600" : "border-slate-700"}
                  >
                    <Cpu className="h-4 w-4 mr-2" />
                    Simulator (Fast)
                  </Button>
                  <Button
                    type="button"
                    variant={useRealHardware ? "default" : "outline"}
                    onClick={() => setUseRealHardware(true)}
                    className={useRealHardware ? "bg-pink-500 hover:bg-pink-600" : "border-slate-700"}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    IBM Quantum Hardware
                  </Button>
                </div>
                <p className="text-xs text-purple-400">
                  {useRealHardware
                    ? "⚡ Real quantum hardware (ibm_brisbane, 127 qubits). Slower but uses actual quantum processors."
                    : "💻 Quantum simulator. Fast and ideal for testing and development."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Resources */}
          <Card className="bg-purple-500/10 border-purple-500/30 mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white text-lg">Estimated Resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-purple-300 mb-1">Estimated Time</div>
                  <div className="text-white font-semibold">
                    {useRealHardware ? `${Math.ceil(maxGenerations * 0.5)}-${Math.ceil(maxGenerations * 1)} min` : `${Math.ceil(maxGenerations * 0.1)}-${Math.ceil(maxGenerations * 0.2)} min`}
                  </div>
                </div>
                <div>
                  <div className="text-purple-300 mb-1">Compute Credits</div>
                  <div className="text-white font-semibold">
                    {useRealHardware ? `~${Math.ceil(maxGenerations * 2)} credits` : `~${Math.ceil(maxGenerations * 0.1)} credits`}
                  </div>
                </div>
                <div>
                  <div className="text-purple-300 mb-1">Success Rate</div>
                  <div className="text-white font-semibold">
                    {targetFitness >= 95 ? "70-85%" : targetFitness >= 90 ? "85-95%" : "95-99%"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!isAuthenticated || createJob.isPending || !circuitSpec.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-1"
            >
              <Zap className="h-4 w-4 mr-2" />
              {createJob.isPending ? "Submitting..." : "Submit Evolution Job"}
            </Button>
            <Link href="/jobs">
              <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                View My Jobs
              </Button>
            </Link>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 bg-slate-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-purple-300">
            <p className="mb-2">
              © 2025 AI4U, LLC. All Rights Reserved. |{" "}
              <a
                href="https://ai4utech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                AI4Utech.com
              </a>{" "}
              | Lee Hanna, Owner
            </p>
            <p className="text-xs text-purple-400">
              Project Chimera™ • Powered by IBM Quantum
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

