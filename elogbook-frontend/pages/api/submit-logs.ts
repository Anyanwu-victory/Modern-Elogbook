import { getClient } from "@/sanity/lib/sanity.client";
import { auth } from "@clerk/nextjs/server";
import { writeToken } from "@/sanity/lib/sanity.api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const client = getClient({ token: process.env.SANITY_API_WRITE_TOKEN || writeToken });

  // Upload image helper function
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

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized: No user ID" });
    }

    const formData = req.body;

    // Validate required fields
    const requiredFields = ["title", "studentId", "date", "activities", "weekNumber"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Upload image if `image_url` is provided
    const imageRef = formData.image_url ? await uploadImage(formData.image_url) : null;

    await client.createIfNotExists({
      _id: `user-${userId}`,
      _type: "user",
      role: "student",
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

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Error submitting log:", error);
    return res.status(500).json({ success: false, error: "Failed to submit log" });
  }
}
