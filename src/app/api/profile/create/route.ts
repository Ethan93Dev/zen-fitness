import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { profileType } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const body: profileType = await req.json();
    const { firstname, lastname, address, city, state, phone } = body;

    if (!firstname || !lastname || !address || !city || !state || !phone) {
      return NextResponse.json(
        { message: "Missing input data" },
        { status: 400 }
      );
    }

    const userId = getDataFromToken(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid or missing token" },
        { status: 401 }
      );
    }

    const checkForUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!checkForUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { userId },
    });
    if (existingProfile) {
      return NextResponse.json(
        { message: "Profile already exists for this user" },
        { status: 409 }
      );
    }

    const createProfile = await prisma.profile.create({
      data: {
        firstname,
        lastname,
        address,
        city,
        state,
        phone,
        userId,
        userrole: "NOTMEMBER", // confirm this field and value exist in your Prisma schema
      },
    });

    return NextResponse.json(createProfile, { status: 201 });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
