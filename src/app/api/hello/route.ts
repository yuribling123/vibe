import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
export async function GET(_req: Request) {
  return NextResponse.json({ message: "hello from backend!" });
}