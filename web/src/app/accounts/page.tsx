"use client";

import { useEffect, useState } from "react";
import { ConnectedAccount, Platform } from "@/lib/types";
import { loadAccounts, saveAccounts, toggleAccount } from "@/store/local";

const PLATFORMS: Platform[] = ["instagram", "facebook", "pinterest"];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);

  useEffect(() => {
    setAccounts(loadAccounts());
  }, []);

  function connect(platform: Platform) {
    const username = prompt(`Enter ${platform} username (simulated)` || "");
    const updated = toggleAccount(platform, username || undefined);
    setAccounts(updated);
  }

  function disconnect(platform: Platform) {
    const updated = accounts.map((a) => (a.platform === platform ? { ...a, connected: false } : a));
    saveAccounts(updated);
    setAccounts(updated);
  }

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Connected Accounts</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p) => {
          const state = accounts.find((a) => a.platform === p && a.connected);
          return (
            <div key={p} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-1 text-lg font-medium capitalize">{p}</div>
              <div className="text-sm text-zinc-500">{state ? `Connected as @${state.username || 'unknown'}` : "Not connected"}</div>
              <div className="mt-3">
                {state ? (
                  <button onClick={() => disconnect(p)} className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Disconnect</button>
                ) : (
                  <button onClick={() => connect(p)} className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-black">Connect</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        OAuth flows are simulated for demo purposes. Persisted locally in your browser.
      </div>
    </div>
  );
}
