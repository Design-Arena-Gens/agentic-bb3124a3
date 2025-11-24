"use client";

import { useEffect, useMemo, useState } from "react";
import { loadScheduledPosts } from "@/store/local";
import { ScheduledPost } from "@/lib/types";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getMonthDays(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [] as Date[];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

function groupByDay(posts: ScheduledPost[]) {
  return posts.reduce<Record<string, ScheduledPost[]>>((acc, p) => {
    const dayKey = new Date(p.scheduledAt).toISOString().slice(0, 10);
    acc[dayKey] = acc[dayKey] || [];
    acc[dayKey].push(p);
    return acc;
  }, {});
}

export function Calendar() {
  const [current, setCurrent] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const groups = useMemo(() => groupByDay(posts), [posts]);

  useEffect(() => {
    setPosts(loadScheduledPosts());
  }, []);

  const days = getMonthDays(current);
  const month = current.toLocaleString("default", { month: "long" });
  const year = current.getFullYear();

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">Content Calendar</div>
          <div className="text-sm text-zinc-500">{month} {year}</div>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md border px-2 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}
          >
            Prev
          </button>
          <button
            className="rounded-md border px-2 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            onClick={() => setCurrent(new Date())}
          >
            Today
          </button>
          <button
            className="rounded-md border px-2 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}
          >
            Next
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const key = d.toISOString().slice(0, 10);
          const dayPosts = groups[key] || [];
          return (
            <div key={key} className="min-h-24 rounded-md border p-2 text-sm dark:border-zinc-700">
              <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                <span>{d.getDate()}</span>
                {dayPosts.length > 0 && (
                  <span className="rounded bg-zinc-100 px-1 py-0.5 text-[10px] dark:bg-zinc-800">
                    {dayPosts.length} scheduled
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayPosts.slice(0, 3).map((p) => (
                  <div key={p.id} className="truncate rounded bg-zinc-50 px-2 py-1 text-xs dark:bg-zinc-800">
                    {p.platforms.join(", ")} ? {p.topic}
                  </div>
                ))}
                {dayPosts.length > 3 && (
                  <div className="text-[11px] text-zinc-500">+{dayPosts.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
