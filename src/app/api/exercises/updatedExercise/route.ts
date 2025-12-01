import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { updateBodyType } from "@/types/types";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updateBody } = body;

    if (!id || !updateBody) {
      return NextResponse.json(
        { message: "Exercise ID and update data are required" },
        { status: 400 }
      );
    }

    // setting updateBody
    const {
      name,
      equipment,
      gifUrl,
      instructions,
      secondaryMuscles,
      target,
    }: updateBodyType = updateBody;

    //Setting Validators for updateBody
    if (
      !name ||
      !equipment ||
      !gifUrl ||
      !instructions ||
      !secondaryMuscles ||
      !target
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // setting token
    const userId = await getDataFromToken(req);
    // error check
    if (!userId) {
      return NextResponse.json(
        { message: "No Token or invalid user" },
        { status: 401 }
      );
    }
    //  updating prisma favoritedExercise.update
    const updateExercise = await prisma.favoritedExercise.update({
      where: { id: id },
      data: {
        name,
        equipment,
        gifUrl,
        instructions,
        secondaryMuscles,
        target,
      },
    });
    console.log(updateExercise);
    return NextResponse.json(
      {
        message: "Exercise updated successfully",
        updateExercise,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Somthing want Wrong updateing", error);
  }
  return NextResponse.json(
    { message: "An error occurred while updating the exercise" },
    { status: 500 }
  );
}
