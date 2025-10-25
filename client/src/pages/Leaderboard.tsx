/**
 * Leaderboard Page - Top Quantum Circuit Evolution Results
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 * Project Chimera™ • Powered by IBM Quantum
 */

import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Leaderboard() {
  const { data: runCards, isLoading } = trpc.orchestrator.getLeaderboard.useQuery({ limit: 50 });

  const applicationLabels: Record<string, string> = {
    drug: "🧬 Drug Discovery",
    finance: "💰 Portfolio Optimization",
    materials: "⚛️ Materials Science",
    aerospace: "🚀 Aerospace",
    telecom: "📡 Telecommunications",
    healthcare: "🏥 Healthcare",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-purple-300">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Project Chimera</h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              🏆 Leaderboard
            </h1>
            <p className="text-xl text-purple-200">
              Top quantum circuit evolution results from the community
            </p>
            <p className="text-sm text-purple-300 mt-2">
              Powered by IBM Quantum • Real Hardware Execution
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {runCards?.length || 0}
                </div>
                <div className="text-purple-200">Total Runs</div>
              </div>
            </Card>
            <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">
                  {runCards && runCards.length > 0 ? `${runCards[0].finalFitness}%` : "—"}
                </div>
                <div className="text-purple-200">Top Fitness</div>
              </div>
            </Card>
            <Card className="p-6 bg-black/40 border-purple-500/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">
                  {runCards ? new Set(runCards.map(r => r.application)).size : 0}
                </div>
                <div className="text-purple-200">Applications</div>
              </div>
            </Card>
          </div>

          {/* Leaderboard Table */}
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/30 bg-purple-950/50">
                    <th className="p-4 text-left text-purple-200 font-semibold">Rank</th>
                    <th className="p-4 text-left text-purple-200 font-semibold">Application</th>
                    <th className="p-4 text-left text-purple-200 font-semibold">Fitness</th>
                    <th className="p-4 text-left text-purple-200 font-semibold">Generations</th>
                    <th className="p-4 text-left text-purple-200 font-semibold">Hardware</th>
                    <th className="p-4 text-left text-purple-200 font-semibold">Date</th>
                    <th className="p-4 text-left text-purple-200 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-purple-300">
                        Loading leaderboard...
                      </td>
                    </tr>
                  ) : !runCards || runCards.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-purple-300">
                        No runs yet. Be the first to submit a quantum circuit evolution!
                      </td>
                    </tr>
                  ) : (
                    runCards.map((run, index) => (
                      <tr
                        key={run.id}
                        className="border-b border-purple-500/20 hover:bg-purple-950/30 transition-colors"
                      >
                        <td className="p-4 text-white font-bold">
                          {index === 0 && "🥇"}
                          {index === 1 && "🥈"}
                          {index === 2 && "🥉"}
                          {index > 2 && `#${index + 1}`}
                        </td>
                        <td className="p-4 text-purple-200">
                          {applicationLabels[run.application] || run.application}
                        </td>
                        <td className="p-4">
                          <span className="text-2xl font-bold text-pink-400">
                            {run.finalFitness}%
                          </span>
                        </td>
                        <td className="p-4 text-purple-200">{run.generations}</td>
                        <td className="p-4 text-purple-200">
                          {run.hardware || "Simulator"}
                        </td>
                        <td className="p-4 text-purple-300 text-sm">
                          {new Date(run.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Link href={`/run/${run.id}`}>
                            <Button variant="outline" size="sm" className="border-purple-500 text-purple-300 hover:bg-purple-950">
                              View Card
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/submit">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                Submit Your Own Evolution
              </Button>
            </Link>
          </div>
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

