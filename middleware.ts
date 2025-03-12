
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    // Sync user data with Prisma
    try {
      await prisma.user.upsert({
        where: {
          id: session.user.id,
        },
        update: {
          email: session.user.email || "",
        },
        create: {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata.name || null,
        },
      });
    } catch (error) {
      console.error("Error syncing user data:", error);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
