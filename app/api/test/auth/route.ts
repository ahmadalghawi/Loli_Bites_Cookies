import { NextResponse } from "next/server";
import { supabaseAuth } from "@/lib/supabase-auth";

export async function GET() {
  try {
    const { data: { session }, error: authError } = await supabaseAuth.auth.getSession();

    if (authError) {
      return NextResponse.json({ error: 'Auth test failed' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Auth test successful',
      session,
      isAuthenticated: !!session
    });
  } catch (error) {
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}