import { auth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getClient } from "@/sanity/lib/sanity.client";
import { writeToken } from "@/sanity/lib/sanity.api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return res.status(401).json({ message: "No user ID" });
    }

    const client = getClient({ token: writeToken });

    const existingUser = await client.getDocument(`user-${userId}`);

    if (!existingUser) {
      console.warn("User document does not exist before patching");
    }

    const body = req.body;

    const { role, ...rest } = body;

    if (!role) {
      return res.status(400).json({ message: "User role is required" });
    }

    await client.createIfNotExists({
      _id: `user-${userId}`,
      _type: "user",
    });

    const patchData: Record<string, any> = { role };

    if (role === "student") {
      patchData.studentDetails = {
        faculty: rest.faculty,
        department: rest.department,
        course: rest.course,
        level: rest.level,
        matricNo: rest.matricNo,
        organizationName: rest.organizationName,
        organizationAddress: rest.organizationAddress,
        supervisorName: rest.supervisorName,
        supervisorEmail: rest.supervisorEmail,
        startDate: rest.startDate,
        endDate: rest.endDate,
      };
    } else {
      patchData.staffDetails = {
        staffId: rest.staffId,
        department: rest.department,
        section: rest.section,
        position: rest.position,
        organizationName: rest.organizationName,
        organizationAddress: rest.organizationAddress,
        officeLocation: rest.officeLocation,
        faculty: rest.faculty,
        signature: rest.signature,
      };
    }

    const result = await client.patch(`user-${userId}`).set(patchData).commit();

    return res.status(200).json(result);
  } catch (error) {
    console.error("[SETUP_PROFILE_PATCH]", error);
    return res.status(500).json({ message: "Something went wrong", error: String(error) });
  }
}
