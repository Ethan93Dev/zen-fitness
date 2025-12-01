import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, workout } = body; // Extract workoutId and updated workout details

    console.log(workout); // Debugging logs

    // Validate required fields
    if (!workout) {
      return NextResponse.json(
        { error: "Missing required fields: workoutId or workout" },
        { status: 400 }
      );
    }

    // Get the userId from the token
    const userId = getDataFromToken(req);

    // Check if the userId is valid
    if (!userId) {
      return NextResponse.json({ message: "No user token" }, { status: 401 });
    }

    // Update the workout details
    const updatedWorkout = await prisma.userWorkout.update({
      where: { id: id, userId: userId },
      data: { workout },
    });

    console.log("Updated Workout:", updatedWorkout); // Debugging logs

    // Return the updated workout
    return NextResponse.json(updatedWorkout, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH /api/workouts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
