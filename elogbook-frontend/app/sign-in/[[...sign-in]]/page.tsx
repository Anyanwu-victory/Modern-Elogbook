"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";

export default function SignIn() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();

  // Dynamic placeholders based on role
  const getPlaceholders = () => {
    switch (role) {
      case "student":
        return {
          email: "Student Email",
          password: "Student Password"
        };
      case "industrySupervisor":
        return {
          email: "Industry Supervisor Email",
          password: "Industry Supervisor Password"
        };
        case "instituteSupervisor":
        return {
          email: "Institute Supervisor Email",
          password: "Institute Supervisor Password"
        };
        case "itfPersonnel":
        return {
          email: "ITF Personnel Email",
          password: "ITF Personnel Password"
        };
      case "admin":
        return {
          email: "Admin Email",
          password: "Admin Password"
        };
      default:
        return {
          email: "Email",
          password: "Password"
        };
    }
  };

  const placeholders = getPlaceholders();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) {
      return;
    }

    try {
      // Attempt to sign in with Clerk
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Clerk handles the session, now redirect based on role
        switch (role) {
          case "student":
            router.push("/dashboard/profile");
            break;
          case "industrySupervisor":
            router.push("/industrySupervisor");
            break;
            case "instituteSupervisor":
            router.push("/instituteSupervisor");
            break;
            case "itfPersonnel":    
            router.push("/itfPersonnel");
            break;
          case "admin":
            router.push("/admin");
            break;
          default:
            router.push("/");
        }
      }
    } catch (err: any) {
      console.error("Error:", err.errors[0].message);
      setError(err.errors[0].message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
          
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <label className="block text-sm font-medium">Select Role</label>
            <select
              className="w-full p-2 mt-1 mb-4 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="industrySupervisor">Industry Supervisor</option>
              <option value="instituteSupervisor">Institute Supervisor</option>
              <option value="admin">Admin</option>
              <option value="itfPersonnel">ITF Personnel</option>
            </select>

            <label className="block text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder={placeholders.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
            />

            <label className="block text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder={placeholders.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6"
              required
            />

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link 
              href="/sign-up" 
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}