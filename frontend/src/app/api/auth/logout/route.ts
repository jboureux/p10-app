// app/api/auth/login/route.ts
import { TOKEN_STORE_LOCATION } from "@/config/auth";
import { callAPI } from "@/lib/api-client";
import { LogOutResponse } from "@/types/auth";
import { GqlError } from "@/types/errors";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  try {
    const token = cookieStore.get(TOKEN_STORE_LOCATION)?.value;

    if (!token) throw new Error("You must have a token to log out");

    const query = `
    mutation Mutation {
      logout
    }
    `;

    const result: LogOutResponse & GqlError = await callAPI<LogOutResponse>({
      query: query,
      token: token,
    });

    if (result.errors) {
      throw new Error("Log out failed");
    }

    cookieStore.delete(TOKEN_STORE_LOCATION);

    // Create a new response
    const nextResponse = NextResponse.json({
      success: true,
      message: "Log out successful",
    });

    // Add the token as an HTTP-only cookie to the response

    return nextResponse;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Log out failed" },
      { status: 400 }
    );
  }
}
