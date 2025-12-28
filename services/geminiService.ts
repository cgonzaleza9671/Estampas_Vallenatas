import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// IMPORTANT: The API key must be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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

export const getGeminiResponse = async (userMessage: string, userName: string, userCity: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "¡Ay hombe! Parece que el acordeón se quedó sin aire (Falta la API Key de Gemini). Por favor configura el sistema.";
  }

  try {
    const contextPrompt = `
    El usuario se llama ${userName} y escribe desde ${userCity}. 
    Pregunta: "${userMessage}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Lo siento compadre, se me fue la nota. Intenta preguntarme de nuevo.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "¡Caramba! Hubo un problema conectando con mi memoria. Inténtalo más tarde, compañero.";
  }
};