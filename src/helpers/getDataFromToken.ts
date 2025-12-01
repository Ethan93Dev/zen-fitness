import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type TokenProps = {
  id: number;
};

export const getDataFromToken = (request: NextRequest): number => {
  try {
    const token = request.cookies.get("token")?.value || "";

    if (!token) {
      throw new Error("No token provided");
    }

    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET env variable is not set");
    }

    const decodedToken = jwt.verify(token, secret) as TokenProps;

    return decodedToken.id;
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    throw new Error("Invalid token");
  }
};
