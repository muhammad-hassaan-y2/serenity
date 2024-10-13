// .ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { role } = req.nextauth.token || {};

    // Protect /quiz route (for Teachers only)
    if (pathname.startsWith("/quiz") && role !== "TEACHER") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Protect /dashboard route (for Students only)
    if (pathname.startsWith("/dashboard") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow users with a valid token
    },
  }
);

export const config = {
  matcher: ["/quiz/:path*", "/dashboard/:path*"], // Apply middleware to these routes
};
