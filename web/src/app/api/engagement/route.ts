import { NextResponse } from "next/server";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET() {
  const now = Date.now();
  const metrics = {
    timestamp: now,
    summary: {
      totalFollowers: randomInt(1200, 9650),
      totalEngagements: randomInt(50, 900),
      engagementRate: Number((Math.random() * 0.12 + 0.02).toFixed(3)),
    },
    byPlatform: [
      { platform: "instagram", likes: randomInt(30, 600), comments: randomInt(2, 50), shares: randomInt(1, 40) },
      { platform: "facebook", likes: randomInt(15, 300), comments: randomInt(1, 30), shares: randomInt(1, 60) },
      { platform: "pinterest", likes: randomInt(10, 200), comments: randomInt(0, 10), shares: randomInt(2, 80) },
    ],
    recentComments: [
      { platform: "instagram", user: "alex", text: "Love this!", when: "2h" },
      { platform: "facebook", user: "sam", text: "Super helpful tips, thanks!", when: "5h" },
      { platform: "pinterest", user: "casey", text: "Pinning this for later!", when: "1d" },
    ],
  };

  return NextResponse.json(metrics);
}

