// utils/syncClerkUserToSanity.ts

import { UserResource } from "@clerk/types";
import  {getClient} from "@/sanity/lib/sanity.client"; // Adjust the path to your sanity client
import { writeToken } from "@/sanity/lib/sanity.api"; // Adjust the path to your sanity API token

export async function syncClerkUserToSanity(user: UserResource) {
    const client = getClient({ token: writeToken});

  if (!user?.id || !user.primaryEmailAddress) return null;

  const userDoc = {
    _type: "user",
    _id: user.id, // use Clerk user.id as Sanity _id to avoid mismatch
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.primaryEmailAddress.emailAddress,
    fullName: user.fullName || `${user.firstName} ${user.lastName}`,
    role: "student", // or dynamically detect if you have role logic
  };

  try {
    const sanityUser = await client.createIfNotExists(userDoc);
    return sanityUser; // contains _id
  } catch (err) {
    console.error("Failed to sync Clerk user to Sanity:", err);
    return null;
  }
}
