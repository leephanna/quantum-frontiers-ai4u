/**
 * Job Detail Page - View Evolution Progress
 * © 2025 AI4U, LLC. All Rights Reserved.
 * AI4Utech.com | Lee Hanna, Owner
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Clock, CheckCircle, XCircle, Loader, Copy, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function JobDetail() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = params?.id;

  // Fetch job data with polling
  const { data: job, isLoading } = trpc.orchestrator.getJob.useQuery(
    { id: jobId! },
    {
      enabled: !!jobId,
      refetchInterval: 1000, // Poll every second while running
    }
  );

  if (!jobId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Job ID</h1>
          <Link href="/jobs">
            <Button>View All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-xl">Loading job details...</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", label: "Pending" },
    running: { icon: Loader, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", label: "Running" },
    completed: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", label: "Completed" },
    failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "Failed" },
  };

  const status = statusConfig[job.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  const progress = job.maxGenerations ? ((job.currentGeneration ?? 0) / job.maxGenerations) * 100 : 0;
  const bestFitness = (job.bestFitness ?? 0) / 100;
  const avgFitness = (job.avgFitness ?? 0) / 100;
  const targetFitness = (job.targetFitness ?? 95) / 100;

  const handleCopyJobId = () => {
    navigator.clipboard.writeText(jobId);
    alert("Job ID copied to clipboard!");
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Job URL copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/jobs">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyJobId}>
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Title & Status */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <StatusIcon className={`h-8 w-8 ${status.color} ${job.status === 'running' ? 'animate-spin' : ''}`} />
            <h1 className="text-4xl font-bold text-white">Job {jobId.substring(0, 8)}...</h1>
            <Badge className={`${status.bg} ${status.color} ${status.border}`}>
              {status.label}
            </Badge>
          </div>
          <p className="text-purple-200 text-lg">{job.circuitSpec}</p>
        </div>

        {/* Job Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-300 mb-2">Application</div>
              <div className="text-xl font-bold text-white capitalize">{job.application.replace('_', ' ')}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-300 mb-2">Environment</div>
              <div className="text-xl font-bold text-white">
                {job.useRealHardware ? "IBM Quantum Hardware" : "Simulator"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-sm text-purple-300 mb-2">Created</div>
              <div className="text-xl font-bold text-white">
                {job.createdAt ? new Date(job.createdAt).toLocaleString() : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Evolution Progress</CardTitle>
            <CardDescription className="text-purple-200">
              Generation {job.currentGeneration} of {job.maxGenerations}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-purple-300 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Fitness Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-sm text-purple-300 mb-2">Best Fitness</div>
                  <div className="text-3xl font-bold text-white">
                    {bestFitness.toFixed(4)}
                    <span className="text-sm text-purple-400 ml-2">({Math.round(bestFitness * 100)}%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-sm text-purple-300 mb-2">Avg Fitness</div>
                  <div className="text-3xl font-bold text-pink-400">
                    {avgFitness.toFixed(4)}
                    <span className="text-sm text-purple-400 ml-2">({Math.round(avgFitness * 100)}%)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-sm text-purple-300 mb-2">Target</div>
                  <div className="text-3xl font-bold text-green-400">
                    {targetFitness.toFixed(4)}
                    <span className="text-sm text-purple-400 ml-2">({Math.round(targetFitness * 100)}%)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Circuit Result */}
        {job.result && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Best Circuit Found</CardTitle>
              <CardDescription className="text-purple-200">
                Optimized quantum circuit (OPENQASM format)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900/50 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                <pre>{String(typeof (job.result as any)?.circuit === 'string' ? (job.result as any).circuit : JSON.stringify(job.result, null, 2))}</pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {job.status === "failed" && job.errorMessage && (
          <Card className="bg-red-500/10 border-red-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-red-400">Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300">{job.errorMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/submit">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Submit New Job
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10">
              View All Jobs
            </Button>
          </Link>
        </div>
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

