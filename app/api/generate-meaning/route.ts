import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export async function POST(req: Request) {
  try {
    const { word, language } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a language expert. Provide an explanation for the word "${word}" in markdown format. Include:
      1. Definition
      2. Etymology (if relevant)
      3. Example usage
      4. Related words
      5. Cultural notes (if any)
      
      Use the target language: ${language}
      
      Keep the response concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("No response from Gemini API");
    }

    return NextResponse.json({
      meaning: text,
    });
  } catch (error) {
    console.error("Error in generate-meaning:", error);
    return NextResponse.json(
      { error: "Failed to generate meaning", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}