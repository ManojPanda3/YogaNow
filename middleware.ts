import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, generateAccessToken } from '@/lib/auth';

const restricted_paths = ['/cart'];

export async function middleware(request: NextRequest) {
  const access_token = request.cookies.get("access_token")?.value;
  const refresh_token = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  const isRestricted = restricted_paths.some(path => pathname.startsWith(path));
  const response = NextResponse.next();

  if (isRestricted) {
    if (!access_token) {

      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {

      const payload = await verifyAccessToken(access_token);
      response.headers.set("X-current-user-id", payload.payload.id);
      return response;
    } catch (error) {

      console.error(error);

      if (refresh_token) {
        try {

          const refreshPayload = await verifyAccessToken(refresh_token);


          const newAccessToken = await generateAccessToken({ userId: refreshPayload.payload.id });

          response.cookies.set("access_token", newAccessToken, { httpOnly: true, path: "/" });
          response.headers.set("X-current-user-id", refreshPayload.payload.id);

          return response;
        } catch (refreshError) {

          console.error(refreshError);
          const loginUrl = new URL('/auth/login', request.url)
          loginUrl.searchParams.set("from", pathname)
          return NextResponse.redirect(loginUrl);
        }
      }

      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl);
    }
  }


  if (access_token) {
    try {
      const payload = await verifyAccessToken(access_token);
      response.headers.set("X-current-user-id", payload.payload.id);
    } catch (error) {

      console.error(error);
      response.headers.set('X-current-user-id', 'null');
    }
  } else {
    response.headers.set('X-current-user-id', 'null');
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/signup).*)"],
};
