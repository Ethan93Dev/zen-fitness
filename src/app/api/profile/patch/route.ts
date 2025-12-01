import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { profileType } from "@/types/types";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function patch(req: NextRequest) {
  try {
    const body: profileType = await req.json();
    const { firstname, lastname, address, city, state, phone } = body;

    const userId = getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ message: "No user" }, { status: 401 });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { message: "No profile found for this user" },
        { status: 404 }
      );
    }

    const updatedProfile = await prisma.profile.update({
      where: {
        userId: userId,
      },
      data: {
        firstname,
        lastname,
        address,
        city,
        state,
        phone,
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
