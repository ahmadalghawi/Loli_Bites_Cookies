import { NextResponse } from "next/server";
import { createProduct, getProducts, updateProduct } from "@/lib/api/products";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const products = await getProducts();
    console.log("products from api/products/route.ts",products);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const product = await createProduct(body);

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;
    const product = await updateProduct(id, data);

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}