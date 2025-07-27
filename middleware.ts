// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "@/lib/auth";

const restricted_paths = ["/cart"];

export async function middleware(request: NextRequest) {
  const access_token = request.cookies.get("access_token")?.value;
  const refresh_token = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  if (access_token) {
    try {
      const payload = await verifyAccessToken(access_token);
      const response = NextResponse.next();
      response.headers.set("X-current-user-id", payload.id);
      return response;
    } catch (error) {
      console.log("Access token expired or invalid, trying refresh token.");
    }
  }

  if (refresh_token) {
    try {
      const refreshPayload = await verifyRefreshToken(refresh_token);

      const newAccessToken = await generateAccessToken({ id: refreshPayload.id, email: refreshPayload.email });

      const response = NextResponse.next();
      response.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        path: "/",
      });
      response.headers.set("X-current-user-id", refreshPayload.id);

      return response;
    } catch (refreshError) {
      console.log("Refresh token also expired or invalid.");
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  const isRestricted = restricted_paths.some((path) => pathname.startsWith(path));
  if (isRestricted) {
    console.log("Access denied to restricted path:", pathname);
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/signup).*)",
  ],
};
