import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Error during logout" },
      { status: 500 }
    );
  }
}
