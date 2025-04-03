import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  // Mock validation per role
  if (role === "student" && name === "Anyanwu" && email === "student@example.com" && password === "student123") {
    return NextResponse.json({ success: true, role });
  }
  else if (role === "supervisor" && name === "Supervisor" && email === "supervisor@example.com" && password === "supervisor123") {
    return NextResponse.json({ success: true, role });
  }
  else if (role === "admin" && name === "Admin" && email === "admin@example.com" && password === "admin123") {
    return NextResponse.json({ success: true, role });
  }
  
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}