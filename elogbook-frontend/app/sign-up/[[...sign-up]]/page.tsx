"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useSignUp } from "@clerk/nextjs";

export default function SignUp() {
  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();

  // Dynamic placeholders based on role
  const getPlaceholders = () => {
    switch (role) {
      case "student":
        return {
          firstName: "Student First Name",
          lastName: "Student Last Name",
          email: "Student Email",
          password: "Student Password"
        };
      case "industrySupervisor":
        return {
          firstName: "Industry Supervisor First Name",
          lastName: "Industry Supervisor Last Name",
          email: "Industry Supervisor Email",
          password: "Industry Supervisor Password"
        };
        case "insituteSupervisor":
        return {
          firstName: "Insitute Supervisor First Name",
          lastName: "Insitute Supervisor Last Name",
          email: "Insitute Supervisor Email",
          password: "Insitute Supervisor Password"
        };
        case "itfPersonnel": 
        return {
          firstName: "ITF Personnel First Name",
          lastName: "ITF Personnel Last Name",
          email: "ITF Personnel Email",
          password: "ITF Personnel Password"
        };
      case "admin":
        return {
          firstName: "Admin First Name",
          lastName: "Admin Last Name",
          email: "Admin Email",
          password: "Admin Password"
        };
      default:
        return {
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          password: "Password"
        };
    }
  };

  const placeholders = getPlaceholders();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isLoaded) {
      return;
    }

    try {
      // Start the sign-up process with Clerk
      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Send verification email
      await result.prepareEmailAddressVerification({ strategy: "email_code" });

      // Store the role in Clerk's metadata
      await signUp.update({
        unsafeMetadata: {
          role: role
        }
      });

      // Redirect to verification page
      router.push("/auth/verify-email");
    } catch (err: any) {
      console.error("Error:", err.errors[0].message);
      setError(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
          
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Select Role</label>
              <select
                className="w-full p-2 mt-1 mb-4 border rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
              <option value="industrySupervisor">Industry Supervisor</option>
              <option value="instituteSupervisor">Institute Supervisor</option>
              <option value="admin">Admin</option>
              <option value="itfPersonnel">ITF Personnel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">First Name</label>
              <Input
                type="text"
                placeholder={placeholders.firstName}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <Input
                type="text"
                placeholder={placeholders.lastName}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder={placeholders.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder={placeholders.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Add this div for Clerk's CAPTCHA */}
            <div id="clerk-captcha"></div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link 
              href="/sign-in" 
              className="text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}