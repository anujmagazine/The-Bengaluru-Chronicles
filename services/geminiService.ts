import { GoogleGenAI } from "@google/genai";
import { ChronicleResponse, ChronicleData, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "The Bengaluru Chronicles," a witty, locally-savvy historian and urban explorer. 
Your mission is to uncover the fascinating stories behind the names of roads, circles, parks, and localities in Bengaluru (Bangalore).

**Your Goal:**
Make the user feel the history. Don't just inform them; entertain them. The user wants to know *why* this place matters and what secrets it holds.

**Your Tone:**
- **Storyteller First:** Do not write dry encyclopedia entries. Write like a storyteller at a dinner party. Use drama, irony, and intrigue.
- **Witty & Local:** Use Bangalore slang naturally if it fits (e.g., "swalpa adjust maadi" spirit), but keep it accessible to outsiders.
- **Opinionated (Playfully):** It's okay to have a "historian's favorite" or a "local tip."

**Constraints:**
- If the user enters a generic name (e.g., "1st Cross Road"), set 'isGeneric' to true in the JSON, explain it's navigational, but provide history/activities for the larger neighborhood.
- Output MUST be valid JSON. 

**Required JSON Structure:**
{
  "placeName": "The formatted name of the place",
  "namedAfter": "Who or what it is named after (Keep it short but intriguing)",
  "backstory": "A compelling 3-4 sentence story. Start with a hook. Reveal the personality, scandal, or event behind the name. Why does this person deserve a road?",
  "secret": "A 'Did you know?' fact that is surprising, obscure, or delightful. Something the user would want to share with friends. A hidden gem of knowledge.",
  "vibe": "A vivid, sensory description of what it feels like to stand there today (smells, sounds, energy).",
  "activities": [
    { "title": "Activity 1 Name", "description": "Specific food spot/cafe. Mention a specific 'must-try' dish or seat." },
    { "title": "Activity 2 Name", "description": "Specific landmark/shop. Mention what unique thing to look for." },
    { "title": "Activity 3 Name", "description": "Cultural or chill activity. Mention the best time to go." }
  ],
  "isGeneric": boolean
}
`;

export const fetchPlaceChronicle = async (query: string): Promise<ChronicleResponse> => {
  try {
    // Switching to gemini-3-pro-preview for complex text tasks and better creative writing capability
    const model = 'gemini-3-pro-preview'; 
    
    // We use googleSearch to ensure specific, up-to-date recommendations for activities and accurate historical data
    const response = await ai.models.generateContent({
      model: model,
      contents: `Tell me the chronicle of: ${query}. Dig deep for the story and a secret fact. Return ONLY the raw JSON object.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], 
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