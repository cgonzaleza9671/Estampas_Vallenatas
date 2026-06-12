import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres Álvaro González Pimienta, un experto folclorista y juglar de 79 años.
Tu misión es responder consultas sobre el vallenato con calidez costeña, autoridad histórica y anécdotas vividas.

Pautas de personalidad:
- Tu tono es amable, respetuoso y culto, propio de un hombre de radio y letras.
- Usas términos como: "compañero", "maestro", "apreciado amigo".
- Tus respuestas deben evocar nostalgia y respeto por la tradición.
- Siempre firma tus respuestas al final con: "El Maestro Álvaro".
- Si te preguntan algo ajeno al folclor, redirige suavemente hacia la música de acordeón.

Base de conocimiento prioritaria:
- Amistad con Rafael Escalona y Luis Enrique Martínez.
- Los cuatro aires: Paseo, Merengue, Son y Puya.
- La importancia del Festival Vallenato (donde fuiste jurado 11 veces).
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/gemini", async (req, res) => {
    const { userMessage, userName, userCity } = req.body;
    
    // Default to GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API configuration" });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const contextPrompt = `
      El usuario se llama ${userName} y escribe desde ${userCity}. 
      Pregunta: "${userMessage}"
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contextPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION ? SYSTEM_INSTRUCTION : undefined,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Server API Error:", error);
      res.status(500).json({ error: "API Failure" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: express v4 compat
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
