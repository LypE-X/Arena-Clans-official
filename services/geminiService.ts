import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client.
// In a real scenario, ensure process.env.API_KEY is available. 
// If not available in this demo environment, the service handles the error gracefully.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateTeamDescription = async (
  teamName: string,
  game: string,
  style: string
): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key missing. Returning placeholder.");
    return `Equipe ${teamName} focada em ${game}. Jogamos competitivamente no estilo ${style}.`;
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Crie uma descrição curta, impactante e profissional para um perfil de equipe de e-sports.
      Nome da equipe: ${teamName}
      Jogo: ${game}
      Estilo de jogo: ${style}
      Idioma: Português (Brasil)
      Limite: 2 frases. Use emojis relacionados a jogos.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || "Descrição não gerada.";
  } catch (error) {
    console.error("Error generating description:", error);
    return `Equipe ${teamName} de ${game}. Estilo: ${style}.`;
  }
};