import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseService } from "@/lib/supabase-service";

export async function POST(request: Request) {
  try {
    const { email, password, name, phoneNumber, postCode, city, address } = await request.json();

    // Create auth user with role in metadata
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user', // Set role in auth metadata
        },
      },
    });

    if (signUpError) {
      console.error('Signup error:', signUpError);
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

    // Create user profile using service role client
    const { error: profileError } = await supabaseService
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        name,
        role: 'user', // Ensure role is set in users table
        phone_number: phoneNumber,
        post_code: postCode,
        city,
        address,
      }]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'User created successfully',
      user: authData.user 
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}