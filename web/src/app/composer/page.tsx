"use client";

import { useEffect, useMemo, useState } from "react";
import { GeneratedContent, Platform, ScheduledPost } from "@/lib/types";
import { upsertScheduledPost, loadAccounts } from "@/store/local";

const PLATFORMS: Platform[] = ["instagram", "facebook", "pinterest"];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ComposerPage() {
  const [category, setCategory] = useState("tech");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("informative");
  const [imageUrl, setImageUrl] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["instagram"]);
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string>("");

  const connected = useMemo(() => loadAccounts().filter((a) => a.connected).map((a) => a.platform), []);

  useEffect(() => {
    if (connected.length > 0) setPlatforms([connected[0]]);
  }, [connected.length]);

  async function handleGenerate() {
    setLoading(true);
    setNotice("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, topic, tone }),
      });
      const data = (await res.json()) as GeneratedContent & { error?: string };
      if (data && !("error" in data)) setGenerated(data);
      else setNotice(data.error || "Failed to generate");
    } catch (e) {
      setNotice("Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishNow() {
    if (!generated) return;
    const post: ScheduledPost = {
      id: uid(),
      platforms,
      imageUrl: imageUrl || undefined,
      category,
      topic,
      caption: generated.caption,
      hashtags: generated.hashtags,
      scheduledAt: new Date().toISOString(),
      status: "posted",
    };
    upsertScheduledPost(post);
    setNotice("Published now (simulated)");
  }

  function handleSchedule() {
    if (!generated || !scheduledAt) return;
    const post: ScheduledPost = {
      id: uid(),
      platforms,
      imageUrl: imageUrl || undefined,
      category,
      topic,
      caption: generated.caption,
      hashtags: generated.hashtags,
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: "scheduled",
    };
    upsertScheduledPost(post);
    setNotice("Scheduled (saved locally)");
  }

  function togglePlatform(p: Platform) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2 space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-3 text-lg font-semibold">Compose</div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm text-zinc-500">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                {['tech','travel','food','fitness','fashion','business','diy'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-zinc-500">Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                {['informative','playful','persuasive','inspirational'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-zinc-500">Topic</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., 5 productivity tools for devs" className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm text-zinc-500">Image URL (optional)</label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleGenerate} disabled={loading || !topic} className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black">{loading ? 'Generating...' : 'Generate'}</button>
            <div className="text-sm text-zinc-500">Uses heuristic generator (no external API)</div>
          </div>
        </div>

        {generated && (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 text-lg font-semibold">Preview</div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm text-zinc-500">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button key={p} onClick={() => togglePlatform(p)} className={`rounded-full border px-3 py-1 text-xs capitalize ${platforms.includes(p) ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black' : 'hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-zinc-500">Schedule</label>
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-zinc-500">Caption</label>
                <textarea value={generated.caption} onChange={(e) => setGenerated({ ...generated, caption: e.target.value })} rows={6} className="w-full rounded-md border px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm text-zinc-500">Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {generated.hashtags.map((h, idx) => (
                    <span key={idx} className="rounded-full bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">{h}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={handlePublishNow} className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Post now</button>
              <button onClick={handleSchedule} disabled={!scheduledAt} className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-black">Schedule</button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Connected platforms</div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {connected.length === 0 ? (
              <div>No accounts connected. Connect accounts on the Accounts page.</div>
            ) : (
              <div>{connected.join(", ")}</div>
            )}
          </div>
        </div>
        {notice && (
          <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            {notice}
          </div>
        )}
      </div>
    </div>
  );
}
