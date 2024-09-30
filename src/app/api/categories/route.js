import { Category } from "@/models/Category";
import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  
  if (await isAdmin()) {
    if (data.name && typeof data.name === 'string') {
      try {
        const newCategory = await Category.create({ name: data.name.trim() });
        return Response.json(newCategory);
      } catch (error) {
        console.error("Error creating new category:", error);
        return Response.json({ error: "Failed to create new category" }, { status: 400 });
      }
    } else {
      return Response.json({ error: "Category name is required" }, { status: 400 });
    }
  } else {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  return Response.json(await Category.find());
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const {_id, name} = await req.json();
  if (await isAdmin()) {
    await Category.updateOne({_id}, {name});
  }
  return Response.json(true);
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Category.deleteOne({_id});
  }
  return Response.json(true);
}