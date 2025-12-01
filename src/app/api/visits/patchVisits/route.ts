import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { WorkoutPlanInput } from "@/types/types";

export async function PATCH(req: NextRequest) {
  try {
    const body: WorkoutPlanInput = await req.json();
    const { userId, checkout } = body;

    console.log("Request Body:", body);

    if (!userId || !checkout) {
      return NextResponse.json(
        { error: "Missing required fields: userId and checkout" },
        { status: 400 }
      );
    }

    // Retrieve and validate user token
    const userToken = getDataFromToken(req);
    if (!userToken) {
      return NextResponse.json(
        { error: "Unauthorized: No user logged in" },
        { status: 401 }
      );
    }

    console.log("Updating visit for userId:", userId);

    // Find the most recent visit with a null checkout
    const activeVisit = await prisma.visits.findFirst({
      where: { userId, checkout: null },
      orderBy: { checkin: "desc" },
    });

    if (!activeVisit) {
      return NextResponse.json(
        { error: "No active visit record found for this userId" },
        { status: 404 }
      );
    }

    console.log("Active Visit:", activeVisit);

    // Find the user's most recent workout
    const findUserWorkout = await prisma.userWorkout.findFirst({
      where: { userId },
      orderBy: { id: "desc" },
    });

    // Update the visit record
    const updatedVisit = await prisma.visits.update({
      where: { id: activeVisit.id },
      data: {
        checkout,
        userWorkouts: findUserWorkout
          ? { connect: { id: findUserWorkout.id } }
          : undefined,
      },
    });

    console.log("Updated Visit:", updatedVisit);

    return NextResponse.json(
      { message: "Visit updated successfully", data: updatedVisit },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error updating visit:",
      error instanceof Error ? error.message : error
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
