import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    // Extract the user token
    const userToken = getDataFromToken(req);

    // Validate the token
    if (!userToken) {
      return NextResponse.json(
        { error: "Unauthorized: No valid token found" },
        { status: 401 }
      );
    }

    // Fetch visits for the user
    const userVisits = await prisma.visits.findMany({
      where: { userId: userToken },
      orderBy: { checkin: "desc" },
    });

    // Format visits and calculate time spent
    const formattedVisits = userVisits.map((visit) => {
      const checkinDate = new Date(visit.checkin);
      const checkoutDate = visit.checkout ? new Date(visit.checkout) : null;
      const id = visit.id;

      // Calculate visit time in milliseconds
      const visitDurationMs = checkoutDate
        ? checkoutDate.getTime() - checkinDate.getTime()
        : 0;

      // Convert milliseconds to hours and minutes
      const visitDurationHours = Math.floor(visitDurationMs / (1000 * 60 * 60));
      const visitDurationMinutes = Math.floor(
        (visitDurationMs % (1000 * 60 * 60)) / (1000 * 60)
      );

      return {
        checkin: checkinDate.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        checkout: checkoutDate
          ? checkoutDate.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })
          : null,
        visitDuration: checkoutDate
          ? `${visitDurationHours}h ${visitDurationMinutes}m`
          : "N/A", // If no checkout, duration is not available
        id,
      };
    });

    return NextResponse.json({ visits: formattedVisits }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user visits:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
