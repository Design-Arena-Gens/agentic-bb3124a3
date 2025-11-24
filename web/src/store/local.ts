"use client";

import { ScheduledPost, ConnectedAccount } from "@/lib/types";

const SCHEDULE_KEY = "scheduledPosts.v1";
const ACCOUNTS_KEY = "connectedAccounts.v1";

export function loadScheduledPosts(): ScheduledPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    return raw ? (JSON.parse(raw) as ScheduledPost[]) : [];
  } catch {
    return [];
  }
}

export function saveScheduledPosts(posts: ScheduledPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(posts));
}

export function upsertScheduledPost(post: ScheduledPost) {
  const posts = loadScheduledPosts();
  const idx = posts.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.push(post);
  }
  saveScheduledPosts(posts);
}

export function loadAccounts(): ConnectedAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as ConnectedAccount[]) : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: ConnectedAccount[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function toggleAccount(platform: ConnectedAccount["platform"], username?: string) {
  const existing = loadAccounts();
  const idx = existing.findIndex((a) => a.platform === platform);
  if (idx >= 0) {
    existing[idx].connected = !existing[idx].connected;
    if (username) existing[idx].username = username;
  } else {
    existing.push({ platform, connected: true, username });
  }
  saveAccounts(existing);
  return existing;
}
