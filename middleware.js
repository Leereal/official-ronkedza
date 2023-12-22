import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    // "/posts/:id",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
  ],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadthing",
  ],
  afterAuth(auth, req) {
    if (auth.userId && auth.isPublicRoute) {
      let path = "dashboard";
      const dash = new URL(path, req.url);
      return NextResponse.redirect(dash);
    }
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
