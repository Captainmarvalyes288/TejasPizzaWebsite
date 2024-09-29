import { isAdmin } from "@/app/api/auth/[...nextauth]/route";
import { MenuItem } from "@/models/MenuItem";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  if (await isAdmin()) {
    let categoryId = null;
    if (data.category) {
      if (mongoose.Types.ObjectId.isValid(data.category)) {
        categoryId = data.category;
      } else if (typeof data.category === 'string' && data.category.trim() !== '') {
        try {
          const newCategory = await Category.create({ name: data.category.trim() });
          categoryId = newCategory._id;
        } catch (error) {
          console.error("Error creating new category:", error);
          return Response.json({ error: "Failed to create new category" }, { status: 400 });
        }
      }
    }

    try {
      const menuItemDoc = await MenuItem.create({
        ...data,
        category: categoryId
      });
      return Response.json(menuItemDoc);
    } catch (error) {
      console.error("Error creating menu item:", error);
      return Response.json({ error: "Failed to create menu item" }, { status: 400 });
    }
  } else {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  if (await isAdmin()) {
    const { _id, ...data } = await req.json();
    
    let categoryId;
    if (mongoose.Types.ObjectId.isValid(data.category)) {
      categoryId = data.category;
    } else {
      const newCategory = await Category.create({ name: data.category });
      categoryId = newCategory._id;
    }

    await MenuItem.findByIdAndUpdate(_id, {
      ...data,
      category: categoryId
    });
  }
  return Response.json(true);
}

export async function GET() {
  mongoose.connect(process.env.MONGO_URL);
  return Response.json(
    await MenuItem.find().populate('category')
  );
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await MenuItem.deleteOne({_id});
  }
  return Response.json(true);
}