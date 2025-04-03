import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {NextResponse} from 'next/server';

const isProtectedRoute = createRouteMatcher(['/student', '/industrySupervisor', '/instituteSupervisor', '/itfPersonnel', '/admin']);
const isAdminRoute = createRouteMatcher(['/admin']);
const isIndustrySupervisor = createRouteMatcher(['/industrySupervisor']);
const isInstituteSupervisor = createRouteMatcher(['/instituteSupervisor']);
const isITFPersonnel = createRouteMatcher(['/itfPersonnel']);
const isStudent = createRouteMatcher(['/student']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();

  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};