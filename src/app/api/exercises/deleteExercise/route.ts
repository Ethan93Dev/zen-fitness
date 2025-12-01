import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

interface idType {
  id: number;
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    // update to  pull is inside body
    const { id }: idType = body;

    // Validate input
    if (!id) {
      return NextResponse.json(
        { error: "Exercise ID is required" },
        { status: 400 }
      );
    }

    // get user token
    const userId = getDataFromToken(req);

    // Validate user token
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token or no user found" },
        { status: 401 }
      );
    }

    // Delete the exercise where id
    const deletedExercise = await prisma.favoritedExercise.delete({
      where: { id: id },
    });

    // Return success response
    return NextResponse.json(
      {
        message: `Exercise with ID ${id} successfully removed`,

        deletedExercise,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "An internal server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
