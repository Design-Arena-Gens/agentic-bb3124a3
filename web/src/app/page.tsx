import { Calendar } from "@/components/Calendar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Calendar />
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Quick Actions</div>
          <div className="mt-3 grid gap-2">
            <Link
              href="/composer"
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-200"
            >
              Create a post
            </Link>
            <Link
              href="/accounts"
              className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Connect accounts
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Tips</div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Use the Composer to generate captions and hashtags.</li>
            <li>Schedule posts by date/time and platform.</li>
            <li>Track engagement trends on the Engagement page.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
