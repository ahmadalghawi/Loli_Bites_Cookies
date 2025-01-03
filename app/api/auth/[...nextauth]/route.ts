import { NextResponse } from "next/server";
import { supabaseAuth } from "@/lib/supabase-auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: { session }, error } = await supabaseAuth.auth.getSession();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}