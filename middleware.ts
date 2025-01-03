import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Remove middleware completely as we're handling auth on the client side
export const config = {
  matcher: [], // Empty matcher means middleware won't run
};