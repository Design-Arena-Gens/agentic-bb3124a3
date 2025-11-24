"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/composer", label: "Composer" },
  { href: "/accounts", label: "Accounts" },
  { href: "/engagement", label: "Engagement" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 shrink-0 border-r border-zinc-200 bg-white/60 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="px-5 py-4">
        <div className="text-xl font-semibold tracking-tight">Agentic Social</div>
        <div className="mt-1 text-xs text-zinc-500">Manage and automate content</div>
      </div>
      <nav className="mt-4 grid gap-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 text-xs text-zinc-500">
        <p>Inspired by Hootsuite & Buffer</p>
      </div>
    </aside>
  );
}
