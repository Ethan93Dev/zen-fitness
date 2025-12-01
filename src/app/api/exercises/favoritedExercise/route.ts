import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { FavoritedExerciseType } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const body: FavoritedExerciseType = await req.json();
    const {
      id,
      name,
      equipment,
      gifUrl,
      instructions,
      secondaryMuscles,
      target,
      bodyPart,
    } = body;

    // Check for logged in user
    const userDate = getDataFromToken(req);
    if (!userDate) {
      return NextResponse.json({ error: "No user logged in" }, { status: 401 });
    }

    // Validate input fields
    if (
      !name ||
      !equipment ||
      !gifUrl ||
      !instructions ||
      !secondaryMuscles ||
      !target ||
      !bodyPart ||
      !id
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if userWorkout exists
    const userWorkout = await prisma.userWorkout.findUnique({
      where: { id: id },
    });

    if (!userWorkout) {
      return NextResponse.json(
        { error: "User workout not found" },
        { status: 404 }
      );
    }
    //

    // Check if an exercise with this name already exists
    let favoritedExercise = await prisma.favoritedExercise.findUnique({
      where: { name },
    });

    // If the exercise exists, return a message
    if (favoritedExercise) {
      return NextResponse.json(
        {
          message: "This exercise is already in the database.",
          favoritedExercise,
        },
        { status: 400 }
      );
    }
    console.log(favoritedExercise);
    // If the exercise doesn't exist, create it
    favoritedExercise = await prisma.favoritedExercise.create({
      data: {
        name,
        equipment,
        gifUrl,
        instructions,
        secondaryMuscles,
        target,
        bodyPart,
      },
    });
    console.log(favoritedExercise);

    // Update userWorkout with the new favoritedExercise
    const updatedUserWorkout = await prisma.userWorkout.update({
      where: { id: userWorkout.id },
      data: {
        favoritedExercise: {
          connect: { id: favoritedExercise.id },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Favorited exercise added successfully",
        favoritedExercise,
        updatedUserWorkout,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing the workout creation request:", error);
    return NextResponse.json(
      { error: "An internal server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
