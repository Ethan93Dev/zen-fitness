import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, workout } = body;

    // Validate input
    if (!workout) {
      return NextResponse.json(
        { error: "Workout ID and workout details are required" },
        { status: 400 }
      );
    }

    // Get user token and extract user ID
    const userId = getDataFromToken(req);

    // Validate user token
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token or no user found" },
        { status: 401 }
      );
    }

    prisma.userWorkout.findFirst({
      where: { userId: userId },
    });

    await prisma.userWorkout.delete({
      where: { id: id },
    });

    // Response
    return NextResponse.json(
      { message: `User workout with ID ${userId} successfully removed.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the DELETE request:", error);
    return NextResponse.json({ status: 500 });
  }
}
