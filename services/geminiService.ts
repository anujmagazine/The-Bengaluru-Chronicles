import { GoogleGenAI } from "@google/genai";
import { ChronicleResponse, ChronicleData, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "The Bengaluru Chronicles," a witty, locally-savvy historian and urban explorer. 
Your mission is to uncover the fascinating stories behind the names of roads, circles, parks, and localities in Bengaluru (Bangalore).

Your Tone:
- Conversational & Witty: Talk like a friend showing a visitor around. Use local flavor (e.g., "Namma Bengaluru vibe") but keep it accessible.
- Concise: Get straight to the point. No fluff.
- Action-Oriented: The "things to do" should be specific (e.g., "Grab a masala dosa at CTR").
- Historically Accurate: If you don't know, admit it playfully.

Constraints:
- If the user enters a generic name (e.g., "1st Cross Road"), set 'isGeneric' to true in the JSON, explain it's navigational, but provide history/activities for the larger neighborhood.
- Output MUST be valid JSON. Do not include markdown code fences in the response text if possible, but if you do, the code will strip them.

Required JSON Structure:
{
  "placeName": "The formatted name of the place",
  "namedAfter": "Who or what it is named after",
  "backstory": "2-3 sentences explaining history. Punchy.",
  "vibe": "One sentence describing the current atmosphere.",
  "activities": [
    { "title": "Activity 1 Name", "description": "Specific food spot, cafe, or landmark." },
    { "title": "Activity 2 Name", "description": "Specific food spot, cafe, or landmark." },
    { "title": "Activity 3 Name", "description": "Cultural or chill activity." }
  ],
  "isGeneric": boolean
}
`;

export const fetchPlaceChronicle = async (query: string): Promise<ChronicleResponse> => {
  try {
    const model = 'gemini-2.5-flash'; // Good balance of speed and reasoning
    
    // We use googleSearch to ensure specific, up-to-date recommendations for activities
    const response = await ai.models.generateContent({
      model: model,
      contents: `Tell me the chronicle of: ${query}. Return ONLY the raw JSON object.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], 
        // Note: responseMimeType: 'application/json' is NOT supported with googleSearch
        // We must parse the text manually.
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated");
    }

    // Clean up potential markdown fences ```json ... ```
    const cleanJson = text.replace(/```json|```/g, '').trim();
    let data: ChronicleData;
    
    try {
      data = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse JSON", text);
      throw new Error("The chronicler got a bit confused with the formatting. Please try again.");
    }

    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            url: chunk.web.uri
          });
        }
      });
    }

    return { data, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      data: null,
      sources: [],
      error: error instanceof Error ? error.message : "An unexpected error occurred while consulting the archives.",
    };
  }
};
