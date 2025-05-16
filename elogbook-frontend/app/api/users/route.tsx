import { NextResponse } from "next/server"
import { getClient } from "@/sanity/lib/sanity.client"
import { writeToken } from "@/sanity/lib/sanity.api"

// GET: Fetch all users (students and supervisors)
export async function GET() {
  try {
    const client = getClient({token : writeToken})
    const users = await client.fetch(`
      *[_type == "user" && role in ["student", "industry_supervisor", "institution_supervisor"]]{
        _id,
        firstName,
        lastName,
        primaryEmailAddress,
        role
      }
    `)

    const formatted = users.map((user: any) => ({
      id: user._id,
      fullName: user.firstName + " " + user.lastName,
      email: user.primaryEmailAddress,
      role: user.role,
    }))

    return NextResponse.json({ success: true, users: formatted })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST: Assign students to a supervisor
// export async function POST(req: Request) {
//   try {
//     const client = getClient({token : writeToken})
//     const { industrySupervisorId, instituteSupervisorId , studentIds, staffId } = await req.json()

//     console.log(industrySupervisorId, staffId, studentIds)
//     // Check if the request contains the required fields
//     // For each student, update their `supervisor` field in Sanity
//     const patchPromises = studentIds.map((studentId: string) =>
//       client
//      .patch(studentId)
//      .set({
//       industrySupervisor: { _type: "reference", _ref: industrySupervisorId },
//       instituteSupervisor: { _type: "reference", _ref: instituteSupervisorId },
//     })
//     .commit()
//     )

//     await Promise.all(patchPromises)

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error assigning students:", error)
//     return NextResponse.json({ success: false, error: "Failed to assign students" }, { status: 500 })
//   }
// }
export async function POST(req: Request) {
  try {
    const client = getClient({ token: writeToken });
    const { industrySupervisorId, instituteSupervisorId, studentIds } = await req.json();

    if (!industrySupervisorId && !instituteSupervisorId) {
      return NextResponse.json({ success: false, error: "No supervisor ID provided" }, { status: 400 });
    }

    const patchPromises = studentIds.map((studentId: string) => {
      const patchData: Record<string, any> = {};

      if (industrySupervisorId) {
        patchData.industrySupervisor = {
          _type: "reference",
          _ref: industrySupervisorId,
        };
      }

      if (instituteSupervisorId) {
        patchData.instituteSupervisor = {
          _type: "reference",
          _ref: instituteSupervisorId,
        };
      }

      return client.patch(studentId).set(patchData).commit();
    });

    await Promise.all(patchPromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error assigning students:", error);
    return NextResponse.json({ success: false, error: "Failed to assign students" }, { status: 500 });

    
  }

  
  
}
