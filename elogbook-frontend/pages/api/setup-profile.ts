import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getClient } from "@/sanity/lib/sanity.client";
import { writeToken } from "@/sanity/lib/sanity.api";



export async function PATCH(req: Request) {

  const client = getClient({ token: writeToken });
 
  try {
    const { userId } = await auth();

    const existingUser = await client.getDocument(`user-${userId}`)
  
    if (!existingUser) {
      console.warn("user document does not exist before patching")
    }
    
    if (!userId) {
      return NextResponse.json({ message: "No user ID" },
         { status: 401 });
      }

    const body = await req.json();
   
    const { role, ...rest } = body;

    if (!role) return NextResponse.json({ message: "User role is required" }, { status: 400 });

    // Base patch object
    await client.createIfNotExists({
      _id: `user-${userId}`,
      _type: "user",
    });
    
    const patchData: Record<string, any> = {
      role,
    };

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

    const result = await client
      .patch(`user-${userId}`)
      .set(patchData)
      //.commit({ autoGenerateArrayKeys: true });
      .commit()
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("[SETUP_PROFILE_PATCH]", error);
    return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
  }
}
