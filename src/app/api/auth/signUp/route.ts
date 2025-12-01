import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { prisma } from "@/lib/prisma";

import { authType } from "@/types/types";

export async function POST(req: NextRequest) {
  try {
    const body: authType = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Missing user data" },
        { status: 400 }
      );
    }

    // You might want to remove this token check if it's a signup route
    const userId = getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
