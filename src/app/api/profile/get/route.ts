import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    // Validate token and user ID
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "No user logged in" }, { status: 401 });
    }

    // Query the most recent profile plan
    const profile = await prisma.profile.findMany({
      where: { userId: userId },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "No profile plans found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
