"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SignIn() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const response = await fetch("/mock-data.json"); // Corrected path
        const data = await response.json(); // Parse response

      if (response.ok)  {
        console.log(data.mockUser); // Debugging check

        switch (role) {
          case "student":
            router.push("/student/profile");
            break;
          case "supervisor":
            router.push("/supervisor");
            break;
          case "admin":
            router.push("/admin");
            break;
          default:
            throw new Error("Invalid role");
        }
      } else  {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
          <label className="block text-sm font-medium">Select Role</label>
          <select
            className="w-full p-2 mt-1 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="supervisor">School Supervisor</option>
            <option value="admin">Admin</option>
          </select>

          <label className="block text-sm font-medium mt-4">Email</label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm font-medium mt-4">Password</label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full mt-6" onClick={handleSignIn}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
