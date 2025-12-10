// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { readToken } from "@/sanity/lib/sanity.api";
import { getClient, getUserById } from "@/sanity/lib/sanity.client";

// Map roles to their actual route paths
const roleToRoute: Record<string, string> = {
  student: "/dashboard",
  "industry-supervisor": "/industrySupervisor",
  "institution-supervisor": "/instituteSupervisor",
  "itf-personnel": "/itfPersonnel",
  admin: "/admin",
};

const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/industrySupervisor(.*)",
  "/instituteSupervisor(.*)",
  "/itfPersonnel(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};





// The code below is an alternative implementation that handles role-based access control.
// This code is commented out to avoid conflicts with the current implementation.


// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { readToken } from "@/sanity/lib/sanity.api";
// import { getClient, getUserById } from "@/sanity/lib/sanity.client";

// // Map roles to their actual route paths
// const roleToRoute: Record<string, string> = {
//   student: "/dashboard",
//   "industry-supervisor": "/industrySupervisor",
//   "institution-supervisor": "/instituteSupervisor",
//   "itf-personnel": "/itfPersonnel",
//   admin: "/admin",
// };

// const protectedRoutes = createRouteMatcher([
//   "/dashboard(.*)",
//   "/industrySupervisor(.*)",
//   "/instituteSupervisor(.*)",
//   "/itfPersonnel(.*)",
//   "/admin(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { pathname } = req.nextUrl;
//   console.log(`[Middleware] Processing: ${pathname}`);

//   if (!protectedRoutes(req)) {
//     return NextResponse.next();
//   }

//   const { userId } = await auth();

//   if (!userId) {
//     console.log("[Middleware] User not authenticated, redirecting to /login");
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   const client = getClient({ token: readToken });
//   let role: string | null = null;

//   try {
//     const userData = await getUserById(client, userId);
//     role = userData?.role;

//     if (!role) {
//       console.warn(`[Middleware] No role found for user ${userId}, redirecting to /setup-account`);
//       return NextResponse.redirect(new URL("/setup-account", req.url));
//     }

//     console.log(`[Middleware] Authenticated user ${userId} with role ${role}`);
//   } catch (err) {
//     console.error("[Middleware] Failed to fetch user role:", err);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // If user visits "/" or "/dashboard", redirect based on role
//   if (pathname === "/" || pathname === "/dashboard") {
//     const redirectTo = roleToRoute[role] || "/";
//     console.log(`[Middleware] Redirecting to role-specific route: ${redirectTo}`);
//     return NextResponse.redirect(new URL(redirectTo, req.url));
//   }

//   // Check for unauthorized access to other roles' routes
//   const requestedTopLevelRoute = "/" + pathname.split("/")[1]; // e.g., "/admin"
//   const expectedRoute = roleToRoute[role];

//   if (requestedTopLevelRoute !== expectedRoute) {
//     console.warn(`[Middleware] Unauthorized access: expected ${expectedRoute}, but tried to access ${requestedTopLevelRoute}`);
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/dashboard",
//     "/student/:path*",
//     "/industrySupervisor",
//     "/industrySupervisor/:path*",
//     "/instituteSupervisor",
//     "/instituteSupervisor/:path*",
//     "/itfPersonnel",
//     "/itfPersonnel/:path*",
//     "/admin",
//     "/admin/:path*",
//   ],
// };
