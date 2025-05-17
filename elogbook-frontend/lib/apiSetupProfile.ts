// lib/apiSetupProfile.ts

export async function setupUserProfile(data: {
    role: string;
    signature: string;
    [key: string]: any;
  }) {
    const response = await fetch("/api/setup-profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
  
    if (!response.ok) {
      throw new Error(result.error || "Failed to set up profile.");
    }
  
    return result;
  }
  