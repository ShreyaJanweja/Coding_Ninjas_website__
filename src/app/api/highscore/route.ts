import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type HighScoreDoc = {
  game: string;
  score: number;
  updatedAt: Date;
};

const COLLECTION = "scores";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get("game") || "NinjaRunner";
    const db = await getDb();
    const doc = (await db
      .collection<HighScoreDoc>(COLLECTION)
      .findOne({ game })) as HighScoreDoc | null;
    return NextResponse.json(
      { game, score: doc?.score ?? 0, updatedAt: doc?.updatedAt ?? null },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch high score" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get("game") || "NinjaRunner";
    const body = (await request.json().catch(() => ({}))) as {
      score?: number;
    };
    const newScore = typeof body.score === "number" ? body.score : undefined;
    if (newScore === undefined || Number.isNaN(newScore) || newScore < 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    const db = await getDb();
    const coll = db.collection<HighScoreDoc>(COLLECTION);

    const current = await coll.findOne({ game });
    if (!current) {
      await coll.insertOne({ game, score: newScore, updatedAt: new Date() });
      return NextResponse.json(
        { updated: true, score: newScore },
        { status: 200 },
      );
    }

    if (newScore > current.score) {
      await coll.updateOne(
        { game },
        { $set: { score: newScore, updatedAt: new Date() } },
      );
      return NextResponse.json(
        { updated: true, score: newScore },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { updated: false, score: current.score },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update high score" },
      { status: 500 },
    );
  }
}
