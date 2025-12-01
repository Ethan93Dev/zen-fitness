import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    // Extract the user token
    const userToken = getDataFromToken(req);

    if (!userToken) {
      return NextResponse.json(
        {
          message: "No user token",
        },
        { status: 401 }
      );
    }
    const findFirst = await prisma.userWorkout.findMany({
      where: { userId: userToken },
      orderBy: { workout: "desc" },
    });

    // Send back the fetched data
    return NextResponse.json(findFirst, { status: 200 });
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
