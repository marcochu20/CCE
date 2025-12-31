
import { GoogleGenAI, Type } from "@google/genai";
import { Priority, ColumnStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTasksFromProject = async (projectDescription: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this project description: "${projectDescription}", generate a list of 5 essential starter tasks. For each task, provide a title, a brief description, and a suggested priority (Low, Medium, High, Urgent).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            priority: { type: Type.STRING, enum: Object.values(Priority) }
          },
          required: ["title", "description", "priority"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return [];
  }
};
