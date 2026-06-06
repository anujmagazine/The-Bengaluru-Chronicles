import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper for lazy Gemini initialization
  let aiClient: any = null;
  const getAiClient = () => {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error("GEMINI_API_KEY not found. Add it in Settings > Secrets.");
      }
      aiClient = new GoogleGenAI({ 
        apiKey: key,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
    }
    return aiClient;
  };

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

  // API Routes
  app.post("/api/chronicle", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: "Query is required" });
      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Tell me the chronicle of: ${query}. Return ONLY raw JSON object.`,
        config: { 
          systemInstruction: SYSTEM_INSTRUCTION, 
          tools: [{ googleSearch: {} }] 
        },
      });

      const text = response.text;
      const cleanJson = text.replace(/```json|```/g, '').trim();
      let data;
      try {
        data = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Parse Error:", text);
        return res.status(500).json({ error: "The archives returned unreadable data. Try again swalpa later." });
      }

      // Extract grounding sources
      const sources: any[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk) => {
          if (chunk.web?.uri && chunk.web?.title) {
            sources.push({ title: chunk.web.title, url: chunk.web.uri });
          }
        });
      }

      res.json({ data, sources });
    } catch (error: any) {
      console.error("Server Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const distPath = path.join(__dirname, 'dist');
  const isProd = fs.existsSync(path.join(distPath, 'index.html'));

  if (isProd) {
    console.log("Serving production build from /dist");
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log("Starting Vite dev server middleware");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();
