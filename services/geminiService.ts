import { GoogleGenAI } from "@google/genai";

// Access API key safely using Vite's env variable standard
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

export const getCoachComment = async (score: number, shotsTaken: number): Promise<string> => {
  if (!apiKey) {
    console.warn("Google API Key is missing. Returning fallback comment.");
    return "Gut gespielt! (API Key nicht konfiguriert)";
  }

  try {
    // Initialize lazily to prevent crashes if key is invalid/missing at startup
    const ai = new GoogleGenAI({ apiKey });

    const accuracy = shotsTaken > 0 ? Math.round((score / shotsTaken) * 100) : 0;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `
        Du bist ein charismatischer, lustiger Basketball-Coach.
        Ein Spieler hat gerade eine 30-Sekunden-Runde beendet.
        
        Statistiken:
        - Punkte: ${score}
        - Würfe insgesamt: ${shotsTaken}
        - Genauigkeit (impliziert): ${accuracy}% (ungefähr, da jeder Treffer 1 Punkt ist, aber manchmal Würfe daneben gehen).
        
        Gib einen EINZIGEN, kurzen Satz (max 15 Wörter) als Kommentar auf Deutsch ab.
        Sei motivierend, sarkastisch oder lustig, je nach Leistung.
        
        Beispiele:
        - Schlecht: "Der Korb war wohl vernagelt, was?"
        - Gut: "Brenne ich, oder ist es hier so heiß? Wahnsinn!"
      `,
    });

    return response.text?.trim() || "Das war ein Spiel!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Starke Leistung!";
  }
};