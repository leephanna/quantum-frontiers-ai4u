/**
 * Jobs List Page - View All Evolution Jobs
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, Plus, Clock, CheckCircle, XCircle, Loader, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function JobsList() {
  const { user, isAuthenticated } = useAuth();

  // Fetch user's jobs
  const { data: jobs, isLoading } = trpc.orchestrator.listJobs.useQuery(
    { limit: 50 },
    {
      enabled: isAuthenticated,
      refetchInterval: 5000, // Refresh every 5 seconds
    }
  );

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Pending" },
    running: { icon: Loader, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Running" },
    completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "Completed" },
    failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "Failed" },
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
          <Link href="/submit">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2">
              <Plus className="h-4 w-4" />
              New Job
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Evolution Jobs
          </h1>
          <p className="text-xl text-purple-200">
            Track and manage your quantum circuit optimization jobs
          </p>
        </div>

        {/* Authentication Check */}
        {!isAuthenticated && (
          <Card className="bg-yellow-500/10 border-yellow-500/30 mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-yellow-300 font-semibold mb-2 text-lg">Login Required</h3>
                <p className="text-yellow-200 mb-4">
                  Please log in to view your evolution jobs
                </p>
                <a href={getLoginUrl()}>
                  <Button variant="outline" className="border-yellow-500/50 hover:bg-yellow-500/10">
                    Log In
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isAuthenticated && isLoading && (
          <div className="text-center py-12">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-400" />
            <p className="text-purple-200">Loading your jobs...</p>
          </div>
        )}

        {/* Jobs List */}
        {isAuthenticated && !isLoading && jobs && (
          <>
            {jobs.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-purple-200 mb-4">You haven't submitted any jobs yet</p>
                  <Link href="/submit">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Your First Job
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => {
                  const status = statusConfig[job.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  const progress = job.maxGenerations ? ((job.currentGeneration ?? 0) / job.maxGenerations) * 100 : 0;
                  const bestFitness = (job.bestFitness ?? 0) / 100;

                  return (
                    <Card key={job.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <StatusIcon className={`h-5 w-5 ${status.color} ${job.status === 'running' ? 'animate-spin' : ''}`} />
                              <h3 className="text-lg font-semibold text-white">
                                {job.circuitSpec.substring(0, 80)}
                                {job.circuitSpec.length > 80 ? "..." : ""}
                              </h3>
                              <Badge className={`${status.bg} ${status.color} ${status.border}`}>
                                {status.label}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                              <div>
                                <div className="text-purple-300 mb-1">Application</div>
                                <div className="text-white font-semibold capitalize">
                                  {job.application.replace('_', ' ')}
                                </div>
                              </div>
                              <div>
                                <div className="text-purple-300 mb-1">Progress</div>
                                <div className="text-white font-semibold">
                                  {job.currentGeneration ?? 0} / {job.maxGenerations ?? 0}
                                </div>
                              </div>
                              <div>
                                <div className="text-purple-300 mb-1">Best Fitness</div>
                                <div className="text-white font-semibold">
                                  {Math.round(bestFitness * 100)}%
                                </div>
                              </div>
                              <div>
                                <div className="text-purple-300 mb-1">Created</div>
                                <div className="text-white font-semibold">
                                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            {job.status === "running" && (
                              <div className="mt-4">
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <Link href={`/jobs/${job.id}`}>
                              <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
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

