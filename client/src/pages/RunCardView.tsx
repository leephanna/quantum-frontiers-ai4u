/**
 * Run Card View Page - Shareable Quantum Circuit Evolution Results
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 * Project Chimera™ • Powered by IBM Quantum
 */

import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RunCardView() {
  const [, params] = useRoute("/run/:id");
  const runId = params?.id || "";

  const { data: runCard, isLoading, error } = trpc.orchestrator.getRunCard.useQuery(
    { id: runId },
    { enabled: !!runId }
  );

  const applicationLabels: Record<string, string> = {
    drug: "🧬 Drug Discovery",
    finance: "💰 Portfolio Optimization",
    materials: "⚛️ Materials Science",
    aerospace: "🚀 Aerospace Engineering",
    telecom: "📡 Telecommunications",
    healthcare: "🏥 Personalized Medicine",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading run card...</div>
      </div>
    );
  }

  if (error || !runCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Run card not found</div>
          <Link href="/leaderboard">
            <Button>Back to Leaderboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/leaderboard">
            <Button variant="ghost" className="text-white hover:text-purple-300">
              ← Back to Leaderboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Project Chimera</h1>
          <div className="w-32"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Run Card #{runCard.id.slice(0, 8)}
            </h1>
            <p className="text-xl text-purple-200">
              {applicationLabels[runCard.application] || runCard.application}
            </p>
            <p className="text-sm text-purple-300 mt-2">
              Created: {new Date(runCard.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Fitness Score - Hero */}
          <Card className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 border-none mb-8">
            <div className="text-center">
              <div className="text-white/80 text-lg mb-2">Final Fitness Score</div>
              <div className="text-7xl font-bold text-white mb-2">
                {runCard.finalFitness}%
              </div>
              <div className="text-white/80">
                Achieved in {runCard.generations} generations
              </div>
            </div>
          </Card>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Circuit Metrics */}
            <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Circuit Metrics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Circuit Depth:</span>
                  <span className="text-white font-semibold">{runCard.circuitDepth || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Gate Count:</span>
                  <span className="text-white font-semibold">{runCard.gateCount || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Generations:</span>
                  <span className="text-white font-semibold">{runCard.generations}</span>
                </div>
              </div>
            </Card>

            {/* Hardware Info */}
            <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Execution Environment</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Hardware:</span>
                  <span className="text-white font-semibold">{runCard.hardware || "Simulator"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Job ID:</span>
                  <span className="text-purple-300 text-sm font-mono">{runCard.jobId.slice(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200">Run ID:</span>
                  <span className="text-purple-300 text-sm font-mono">{runCard.id.slice(0, 12)}...</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Circuit Code */}
          {runCard.circuit && (
            <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Quantum Circuit (OpenQASM)</h2>
              <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm text-green-400 font-mono">
                {runCard.circuit}
              </pre>
            </Card>
          )}

          {/* Metrics */}
          {runCard.metrics && (
            <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Additional Metrics</h2>
              <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm text-cyan-400">
                {JSON.stringify(runCard.metrics, null, 2) as string}
              </pre>
            </Card>
          )}

          {/* Share Section */}
          <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Share This Result</h2>
            <p className="text-purple-200 mb-4">
              Share this run card with colleagues or on social media
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                📋 Copy Link
              </Button>
              <Link href="/submit">
                <Button className="bg-pink-600 hover:bg-pink-700">
                  🚀 Create Your Own
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-purple-300 text-sm">
            © 2025 AI4U, LLC. All Rights Reserved. |{" "}
            <a
              href="https://ai4utech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              AI4Utech.com
            </a>
            {" "}| Lee Hanna, Owner | Project Chimera™ • Powered by IBM Quantum
          </div>
        </div>
      </footer>
    </div>
  );
}

