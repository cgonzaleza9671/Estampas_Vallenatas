
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
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage, userName, userCity }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Lo siento compadre, se me fue la nota. Intenta preguntarme de nuevo.";
  } catch (error) {
    console.error("Error calling Gemini local API:", error);
    return "¡Caramba! Hubo un problema conectando con mi memoria. Inténtalo más tarde, compañero.";
  }
};
