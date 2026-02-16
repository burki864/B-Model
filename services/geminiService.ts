
import { GoogleGenAI } from "@google/genai";

export const generateKnifeImage = async (prompt: string): Promise<string> => {
  // Initialize Gemini API client using the environment variable directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Enforce Roblox/Low-poly style in the system prompt equivalent
  const fullPrompt = `A single Roblox-style low poly knife, ${prompt}. 
  The knife should be shown from a side profile view, centered on a plain solid white background. 
  High quality, clean topology aesthetic, vibrant colors, stylized 3D render look.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageUrl = '';
  // Safely iterate through response parts to locate the generated image data
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) {
    throw new Error("Failed to generate image data from Gemini.");
  }

  return imageUrl;
};
