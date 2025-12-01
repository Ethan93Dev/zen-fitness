import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to extract the workout data
    const body = await req.json();
    const { workout } = body;
    console.log("Workout received:", workout);

    // Check if the workout title is provided
    if (!workout) {
      return NextResponse.json(
        { error: "Missing required workout title" },
        { status: 400 } // Return a 400 Bad Request error if the workout title is missing
      );
    }

    // Get the userId from the token (authentication helper function)
    const userId = getDataFromToken(req);

    // Check if the userId is valid
    if (!userId) {
      return NextResponse.json(
        { message: "No user token" },
        { status: 401 } // Return a 401 Unauthorized error if the user token is invalid or missing
      );
    }

    // Create the new user workout in the database
    const postWorkout = await prisma.userWorkout.create({
      data: {
        workout, // Workout title
        userId, // Associate the workout with the user
      },
    });

    // Retrieve the most recent visit for the user
    const visit = await prisma.visits.findFirst({
      where: { userId }, // Find the visit record for the current user
    });

    // Check if a visit exists for the user
    if (!visit) {
      return NextResponse.json(
        { error: `No visit found for user ID ${userId}` },
        { status: 404 } // Return a 404 Not Found error if no visit exists for the user
      );
    }

    // Update the Visits table to link the new UserWorkout
    const updateVisit = await prisma.visits.update({
      where: {
        id: visit.id, // Use the visit's ID for the update
      },
      data: {
        userWorkouts: {
          connect: { id: postWorkout.id }, // Connect the new UserWorkout to the visit
        },
      },
    });
    // Log the updateVisits for debugging purposes
    console.log("Linked workout to visit:", updateVisit);

    // Log the created workout for debugging purposes
    console.log("Post Workout:", postWorkout);

    // Return a successful response with the created workout
    return NextResponse.json(postWorkout, { status: 201 }); // 201 Created status code
  } catch (error) {
    // Log the error for debugging
    console.error("Error in POST /api/workouts:", error);

    // Return a generic error message to the client
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // 500 Internal Server Error status code
    );
  }
}
