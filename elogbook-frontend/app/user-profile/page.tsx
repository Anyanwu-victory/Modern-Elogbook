"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { mockUser } from "@/pages/api/mock-data"; // Move your mockUser into a shared file if needed
import {
  CheckCircle2,
  Clock,
  Loader2,
  Users,
  XCircle,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useUser } from "@clerk/nextjs";

interface UserProfilePageProps {
  userRole?:
    | "student"
    | "industrySupervisor"
    | "instituteSupervisor"
    | "itfPersonnel"
    | "admin";
}

export default function UserProfilePage() {
  const router = useRouter();
  const { user } = useUser();
  const userRole = user?.unsafeMetadata?.userRole || "student";

  const getDashboardRoute = () => {
    switch (userRole) {
      case "student":
        return "/dashboard";
      case "industrySupervisor":
        return "/industrySupervisor";
      case "instituteSupervisor":
        return "/instituteSupervisor";
      case "itfPersonnel":
        return "/itfPersonnel";
      case "admin":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  useEffect(() => {
    userRole; // Replace with real Clerk user info if needed
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(getDashboardRoute())}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <CardTitle className="text-lg font-semibold mb-6">
          {" "}
          Profile Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="w-full min-h-screen px-4 md:px-20 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4  ">
            <div className=" space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">UserName</p>
                <p className="text-lg">userRole.userName</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg">
                  userRole.primaryEmailAddress.emailAddress
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="text-lg">userRole.phonenumber</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-lg">userRole</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg">userRole.status</p>
              </div>
            </div>

            <div className="items-center text-start space-y-5">
              <div className="">
                <p className="text-sm text-muted-foreground">Matric Number</p>
                <p className="text-lg">userRole.matric</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="text-lg">userRole.department</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-lg">userRole.level</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faculty</p>
                <p className="text-lg">userRole.faculty</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-lg">userRole.level</p>
              </div>

              <div className="">
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="text-lg">userRole.course</p>
              </div>
            </div>

            <div className="items-center text-start space-y-5">
              <CardHeader>
                <CardTitle className="text-lg font-semibold mb-6">
                  {" "}
                  Organization Information
                </CardTitle>
              </CardHeader>
              <div className="">
                <p className="text-sm text-muted-foreground">IT Organization</p>
                <p className="text-lg">userRole.organization</p>
              </div>

              <div className="">
                <p className="text-sm text-muted-foreground">
                  Organization Address
                </p>
                <p className="text-lg">userRole.address</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Organization Phone
                </p>
                <p className="text-lg">userRole.organizationPhone</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Day of week </p>
                <p className="text-lg">userRole.daysOfweek</p>
              </div>
            </div>

            {/* Add more info if Clerk or DB provides it */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
