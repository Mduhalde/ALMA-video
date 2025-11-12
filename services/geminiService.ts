import { GoogleGenAI } from '@google/genai';
import type { ProcessedFile } from '../types';

function cleanAndParseJson(text: string): string {
    // Gemini can sometimes wrap the JSON in ```json ... ```. This removes it.
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        return match[1];
    }
    return text;
}

export async function generateContent(prompt: string, imageFiles: ProcessedFile[] = []): Promise<string> {
    // FIX: Per guidelines, API key must come from the environment.
    if (!process.env.API_KEY) {
      throw new Error("La clave de API no está configurada en el entorno.");
    }
    // FIX: Use API key from environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const parts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [{ text: prompt }];

        for (const file of imageFiles) {
            if (file.data && file.mimeType) {
                parts.push({
                    inlineData: {
                        mimeType: file.mimeType,
                        data: file.data
                    }
                });
            }
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: parts },
          config: {
            responseMimeType: "application/json",
          }
        });

        const rawText = response.text;
        return cleanAndParseJson(rawText);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // FIX: Rethrow original error to allow for more specific handling in the calling function.
        if (error instanceof Error) {
            throw error;
       }
        throw new Error("Falló la comunicación con el modelo de IA. Revisa la consola para más detalles.");
    }
}
