import { ChronicleResponse } from "../types";

export const fetchPlaceChronicle = async (query: string): Promise<ChronicleResponse> => {
  try {
    const response = await fetch("/api/chronicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Server failed to respond correctly.");
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return {
      data: null,
      sources: [],
      error: error instanceof Error ? error.message : "An unexpected error occurred while consulting the archives.",
    };
  }
};
