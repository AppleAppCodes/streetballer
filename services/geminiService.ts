import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCoachComment = async (score: number, shotsTaken: number): Promise<string> => {
  if (!process.env.API_KEY) return "Gut gespielt! (API Key fehlt)";

  try {
    const accuracy = shotsTaken > 0 ? Math.round((score / shotsTaken) * 100) : 0;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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