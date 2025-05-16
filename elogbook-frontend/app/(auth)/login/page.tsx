"use client";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSignIn, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getClient } from "@/sanity/lib/sanity.client";
import { UserRoleQuery } from "@/sanity/lib/sanity.queries"; // Your GROQ query for user role

const Bg = "/assets/bg.png";
const SchoolLogo = "/assets/full-logo.png";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Initialize to true

  const { isSignedIn, user, isLoaded: isUserLoaded } = useUser();
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const { redirectToSignIn } = useClerk();
  const router = useRouter();

  // Memoized function to fetch user role from Sanity
  const fetchUserRoleFromSanity = useCallback(async (clerkUserId: string): Promise<string> => {
    if (!clerkUserId) {
      console.warn("fetchUserRoleFromSanity called without a clerkUserId.");
      return "student"; // Default role
    }
    try {
      const client = getClient(); // Assumes getClient() is stable
      // Ensure UserRoleQuery is your actual GROQ query string
      // Example: `*[_type == "userProfile" && clerkId == $clerkUserId][0].role`
      const result = await client.fetch(UserRoleQuery, { clerkUserId });

      // Adapt this based on how your Sanity query returns the role
      // If result is an object like { role: "admin" }:
      const role = result?.role || (typeof result === 'string' ? result : null);

      return (role && typeof role === 'string') ? role.trim() : "student"; // Default if role not found/invalid
    } catch (err) {
      console.error("Error fetching user role from Sanity:", err);
      return "student"; // Default role on error
    }
  }, []); // Dependencies: Add if getClient or UserRoleQuery are props/state

  // Memoized function to get dashboard path based on role
  const getDashboardPath = useCallback((role: string) => {
    switch (role.trim().toLowerCase()) { // Trim and convert to lowercase for robustness
      case "student": return "/dashboard";
      case "industry_supervisor": return "/industrySupervisor";
      case "institution_supervisor": return "/instituteSupervisor";
      case "itf": return "/itfPersonnel";
      case "admin": return "/admin";
      default:
        console.warn(`Unknown role for dashboard path: '${role}'`);
        return "/dashboard"; // Sensible default
    }
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { 
      email: "",
      password: "" },
  });

  // Effect for initial authentication check and redirection
  useEffect(() => {
    const handleAuthCheckAndRedirect = async () => {
      if (isSignedIn && user && user.id) {
        // User is signed in, attempt to fetch role and redirect
        try {
          const userRole = await fetchUserRoleFromSanity(user.id);
          const dashboardPath = getDashboardPath(userRole);
          router.push(dashboardPath);
          // If redirection happens, this component might unmount, so setting
          // isCheckingAuth to false might not be necessary for this instance.
        } catch (e) {
          console.error("Redirection error after fetching role:", e);
          toast.error("Failed to redirect based on your role. Using default.");
          router.push(getDashboardPath("student")); // Fallback redirect
          setIsCheckingAuth(false); // Stop loading on critical error if not redirecting away
        }
      } else {
        // User is not signed in (or user object not fully available after Clerk load)
        setIsCheckingAuth(false); // Stop loading, allow login form to render
      }
    };

    // Only run the auth check once Clerk's loading state is resolved
    if (isUserLoaded && isSignInLoaded) {
      handleAuthCheckAndRedirect();
    }
    // If Clerk is still loading, isCheckingAuth remains true (showing loader),
    // and the effect will re-run when isUserLoaded/isSignInLoaded change.

  }, [isSignedIn, user, isUserLoaded, isSignInLoaded, router, fetchUserRoleFromSanity, getDashboardPath]);

  // Form submission handler
  const onSubmit = async (formData: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    setError("");
    try {
      if (!signIn) {
        setError("Sign-in service is not available. Please try again later.");
        setIsSubmitting(false); // Explicitly stop submitting if signIn isn't ready
        return;
      }
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login successful!");
        // Redirection is now handled by the useEffect, which will react to
        // `isSignedIn` and `user` state changes. This avoids race conditions.
        // To ensure the loader shows until redirection, you might set isCheckingAuth to true
        // but this could cause a flicker. It's generally better to let useEffect manage it.
      } else if (result.status === "needs_first_factor" || result.status === "needs_second_factor") {
        setError(`Multi-factor authentication required: ${result.status}.`);
        toast.info("MFA Required", { description: `Please complete the MFA step(s). Status: ${result.status}`});
        // Clerk's UI components or further redirects might be needed here.
      } else {
        setError(`Sign-in failed. Status: ${result.status}`);
        toast.error("Sign-in Failed", { description: `Please check your credentials. Status: ${result.status}`});
      }
    } catch (err: any) {
      const clerkError = err.errors?.[0];
      const message = clerkError?.longMessage || clerkError?.message || "An unknown error occurred during login.";
      setError(message);
      console.error("Login submission error:", err);
      toast.error("Login Error", { description: message, closeButton: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    // Redirect to Clerk's password reset flow.
    // The redirectUrl is where the user will be sent after completing the flow.
    redirectToSignIn({ redirectUrl: "/login" }); // Or your desired post-reset page
  };

  // Conditional rendering for the main loading state
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-bg1">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Main JSX for the login page
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-bg1 p-8 md:mx-auto md:flex-row md:items-center md:justify-center md:space-x-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md p-6 bg-white dark:bg-bg2 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-center mb-8">
            <Image
              src={SchoolLogo}
              alt="School Logo"
              width={92}
              height={38}
              className="w-auto h-auto"
              priority // Add priority if this is a key visual element
            />
          </div>
          <div>
            <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back!
            </h2>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-12">
              Access your assignments, track submissions, and view feedback
              effortlessly.
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="enabled:hover:border-blue-600 disabled:opacity-75"
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="enabled:hover:border-blue-600 disabled:opacity-75"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-right mb-6">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 font-bold dark:text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-500 text-center mb-4 bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
              {error}
            </p>
          )}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold mt-6"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {isSubmitting ? "Logging In..." : "Log In"}
          </Button>
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don’t have an account?{" "}
              <Link
                href="/signup" // Ensure this path is correct
                className="text-blue-600 font-bold dark:text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </Form>
      <div className="w-full max-w-md mt-8 md:mt-0 md:max-w-md lg:max-w-2xl">
        <Image
          src={Bg}
          alt="Abstract background image"
          height={960}
          width={719}
          className="rounded-xl w-auto h-auto object-cover"
          priority // Consider if this image is critical for LCP
        />
      </div>
    </div>
  );
}