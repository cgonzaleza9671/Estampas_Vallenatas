
import { GoogleGenAI } from "@google/genai";

// The Maestro Álvaro personality prompt
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

/**
 * getGeminiResponse calls the Gemini API to get a response from the Maestro Álvaro persona.
 */
export const getGeminiResponse = async (userMessage: string, userName: string, userCity: string): Promise<string> => {
  // Always create a new GoogleGenAI instance inside the function to use the latest API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const contextPrompt = `
    El usuario se llama ${userName} y escribe desde ${userCity}. 
    Pregunta: "${userMessage}"
    `;

    // Use gemini-3-flash-preview for basic Q&A as per guidelines.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    // response.text is a property, not a method.
    return response.text || "Lo siento compadre, se me fue la nota. Intenta preguntarme de nuevo.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "¡Caramba! Hubo un problema conectando con mi memoria. Inténtalo más tarde, compañero.";
  }
};
