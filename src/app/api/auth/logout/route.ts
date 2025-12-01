import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function DELETE(req: NextRequest) {
  try {
    const userToken = getDataFromToken(req);

    // Validate the token
    if (!userToken) {
      return NextResponse.json(
        { error: "Unauthorized: No valid token found" },
        { status: 401 }
      );
    }
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    // update isOnlue to false
    await prisma.user.update({
      where: { id: userToken },
      data: {
        isOnline: false,
      },
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
