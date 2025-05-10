// app/api/auth/login/route.ts
import { TOKEN_STORE_LOCATION } from "@/config/auth";
import { callAPI } from "@/lib/api-client";
import { RegisterResponse } from "@/types/auth";
import { GqlError } from "@/types/errors";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    const query = `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        token
      }
    }
    `;

    const variables = { input: await request.json() };

    const result: RegisterResponse & GqlError = await callAPI<RegisterResponse>(
      {
        query: query,
        variables: variables,
      }
    );

    if (result.errors) {
      throw new Error("Authentication failed");
    }

    const token = result.data.register.token;

    // Create a new response
    const nextResponse = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });

    // Add the token as an HTTP-only cookie to the response
    cookieStore.set({
      name: TOKEN_STORE_LOCATION,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return nextResponse;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}
