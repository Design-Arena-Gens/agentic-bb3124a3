"use client";

import { useEffect, useState } from "react";

type Metrics = {
  timestamp: number;
  summary: { totalFollowers: number; totalEngagements: number; engagementRate: number };
  byPlatform: { platform: string; likes: number; comments: number; shares: number }[];
  recentComments: { platform: string; user: string; text: string; when: string }[];
};

export default function EngagementPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const res = await fetch("/api/engagement");
      const data = (await res.json()) as Metrics;
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
    const id = setInterval(fetchMetrics, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold">Engagement</div>
          <div className="text-sm text-zinc-500">Auto-refreshes every 15s</div>
        </div>
        <button onClick={fetchMetrics} className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {metrics && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-xs uppercase tracking-wide text-zinc-500">Followers</div>
            <div className="mt-1 text-2xl font-bold">{metrics.summary.totalFollowers.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-xs uppercase tracking-wide text-zinc-500">Engagements</div>
            <div className="mt-1 text-2xl font-bold">{metrics.summary.totalEngagements.toLocaleString()}</div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-xs uppercase tracking-wide text-zinc-500">Engagement Rate</div>
            <div className="mt-1 text-2xl font-bold">{(metrics.summary.engagementRate * 100).toFixed(1)}%</div>
          </div>
        </div>
      )}

      {metrics && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 text-lg font-semibold">By Platform</div>
            <div className="space-y-2">
              {metrics.byPlatform.map((p) => (
                <div key={p.platform} className="flex items-center justify-between rounded-md border p-3 text-sm dark:border-zinc-700">
                  <div className="capitalize">{p.platform}</div>
                  <div className="text-zinc-500">?? {p.likes} ? ?? {p.comments} ? ?? {p.shares}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 text-lg font-semibold">Recent Comments</div>
            <div className="space-y-2 text-sm">
              {metrics.recentComments.map((c, i) => (
                <div key={i} className="rounded-md border p-3 dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="capitalize text-zinc-500">{c.platform}</div>
                    <div className="text-xs text-zinc-500">{c.when}</div>
                  </div>
                  <div className="mt-1"><span className="font-medium">@{c.user}</span> {c.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
