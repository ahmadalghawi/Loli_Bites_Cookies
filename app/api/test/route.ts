import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Test database connection by checking products table
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Connection test failed:', error);
      return NextResponse.json({ 
        success: false,
        error: error.message,
        hint: 'Check Supabase console for more details'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Successfully connected to Supabase',
      data: data || [],
      tablesExist: true
    });
  } catch (error: any) {
    console.error('Test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: error?.message || 'Failed to connect to database',
      hint: 'Make sure Supabase connection details are correct'
    }, { status: 500 });
  }
}