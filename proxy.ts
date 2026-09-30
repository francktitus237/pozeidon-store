import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Proxy Next.js 16 : protège /gestion en redirigeant vers /connexion si non authentifié
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminArea = req.nextUrl.pathname.startsWith("/gestion");

  if (isAdminArea && !isLoggedIn) {
    const url = new URL("/connexion", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/gestion/:path*"],
};
