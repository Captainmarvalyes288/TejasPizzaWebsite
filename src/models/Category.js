import mongoose, { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Category = models?.Category || model('Category', CategorySchema);