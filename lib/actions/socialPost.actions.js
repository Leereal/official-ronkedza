"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";
import Post from "../database/models/post.model";

export async function postToSocials(data) {
  try {
    await connectToDatabase();
    console.log("postToSocials : ", data);

    // return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    handleError(error);
  }
}

export async function createFacebookAuth(data) {
  console.log("Add This to database : ", data);
}
export async function deleteFacebookAuth(data) {
  console.log("Delete this : ", data);
}
