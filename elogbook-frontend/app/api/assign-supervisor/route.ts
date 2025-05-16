// /app/api/assign-supervisors/route.ts
import { getClient } from "@/sanity/lib/sanity.client";
import { NextResponse } from "next/server";
import {writeToken} from "@/sanity/lib/sanity.api";

export async function POST(req: Request) {
  const { studentId, institutionSupervisorId, industrySupervisorId } = await req.json();

  try {
    const client = getClient({ token: writeToken });
    const existingStudent = await client.getDocument(studentId);
    const patch = client.patch(studentId);

    if (institutionSupervisorId) {
      patch.set({
        institutionSupervisor: {
          _type: "reference",
          _ref: institutionSupervisorId,
        },
      });
    }

    if (industrySupervisorId) {
      patch.set({
        industrySupervisor: {
          _type: "reference",
          _ref: industrySupervisorId,
        },
      });
    }

    await patch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
  }
}
