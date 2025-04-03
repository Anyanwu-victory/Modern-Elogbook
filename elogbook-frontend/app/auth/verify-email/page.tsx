"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp, useSignIn, useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VerifyEmailPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { user } = useUser();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpLoaded && !signInLoaded) {
      return setError("System not ready, please try again");
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      if (signUp) {
        const { status } = await signUp.attemptEmailAddressVerification({ code });
  
        if (status === "complete") {
          router.push(getRedirectPath());
          return;
        }
      } else if (signIn) {
        const { status } = await signIn.attemptFirstFactor({ strategy: "email_code", code });
  
        if (status === "complete") {
          router.push(getRedirectPath());
          return;
        }
      }
  
      setError("Verification failed - please try again");
    } catch (err) {
      handleVerificationError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getRedirectPath = () => {
    const role = user?.publicMetadata?.role as string | undefined;
    const routes: Record<string, string> = {
      student: "/student/profile",
      industrySupervisor: "/industrySupervisor",
      instituteSupervisor: "/instituteSupervisor",
      itfPersonnel: "/itfPersonnel",
      admin: "/admin",
    };
    return routes[role!] || redirectUrl;
  };

  const handleSuccessfulVerification = () => {
    const redirectPath = getRedirectPath();
    router.push(redirectPath);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  const handleVerificationError = (err: any) => {
    const errorMsg = err?.errors?.[0]?.message || "Verification failed. Please try again.";
    setError(errorMsg);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Verify Email</h2>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>
          )}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Verification Code</label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
