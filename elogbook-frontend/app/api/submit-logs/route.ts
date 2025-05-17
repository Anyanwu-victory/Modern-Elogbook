import { getClient } from "@/sanity/lib/sanity.client";
import { auth } from "@clerk/nextjs/server";
import { writeToken } from "@/sanity/lib/sanity.api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const client = getClient({ token: process.env.SANITY_API_WRITE_TOKEN || writeToken });
 
  // Function to upload an image to Sanity
  async function uploadImage(imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
      }

      const blob = await response.blob();

      const asset = await client.assets.upload("image", blob, {
        filename: `uploaded-image-${Date.now()}`, // Dynamic filename
      });

      return {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // Return null if the upload fails
    }
  }

  try {
    const { userId } = await auth();
    const formData = await request.json();

    // Validate required fields
    const requiredFields = ["title", "studentId", "date", "activities", "weekNumber"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Upload image if `image_url` is provided
    const imageRef = formData.image_url ? await uploadImage(formData.image_url) : null;

     await client.createIfNotExists({
      _id: `user-${userId}`,
      _type: "user",
      role: "student"
     }); 

    // Create the log document in Sanity
    const result = await client.create({
      _type: "log",
      title: formData.title,
      studentId: {
        _type: "reference",
        _ref: `user-${userId}`,
      },
      date: formData.date,
      activities: formData.activities,
      weekNumber: formData.weekNumber,
      day: formData.day,
      images: imageRef ? [imageRef] : [], // Add image reference if available
      status: "pending",
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error submitting log:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit log" },
      { status: 500 }
    );
  }
}