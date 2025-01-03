import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, phoneNumber, postCode, creditCard, city, address } = body;

    const existingUsers = await query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    ) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await query(
      `INSERT INTO users (id, email, password, name, phoneNumber, postCode, creditCard, city, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, hashedPassword, name, phoneNumber, postCode, creditCard, city, address]
    );

    const [user] = await query(
      "SELECT id, email, name, phoneNumber, postCode, city, address FROM users WHERE id = ?",
      [userId]
    ) as any[];

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumber, postCode, creditCard, city, address } = body;

    await query(
      `UPDATE users 
       SET phoneNumber = ?, postCode = ?, creditCard = ?, city = ?, address = ?
       WHERE email = ?`,
      [phoneNumber, postCode, creditCard, city, address, session.user?.email]
    );

    const [user] = await query(
      "SELECT id, email, name, phoneNumber, postCode, city, address FROM users WHERE email = ?",
      [session.user?.email]
    ) as any[];

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating user" },
      { status: 500 }
    );
  }
}