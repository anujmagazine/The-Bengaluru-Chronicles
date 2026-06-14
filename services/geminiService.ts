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
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server failed to respond correctly.");
      } else {
        const text = await response.text();
        console.error("Non-JSON error response:", text);
        if (text.includes("<!DOCTYPE") || text.includes("<html")) {
          throw new Error("The chronicler met an unexpected wall. Please wait a moment and try again.");
        }
        throw new Error(`The archive returned an unexpected format (${response.status}).`);
      }
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("The chronicler's response was not in the expected format.");
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
