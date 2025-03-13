import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export async function POST(req: Request) {
  try {
    const { word, language } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabaseUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        interfaceLanguage: true,
        studyLanguage: true,
      },
    });

    const prompt = `Please explain the meaning of the word "${word}" in ${supabaseUser?.interfaceLanguage?.nameEn}, including slang if applicable.
   the word "${word}" is a word in ${supabaseUser?.studyLanguage?.nameEn}.
    This application is for a speaker of ${supabaseUser?.interfaceLanguage?.nameEn} to learn ${supabaseUser?.studyLanguage?.nameEn} by building vocabulary list.
    Format the response in markdown as follows:

## ${word}

### Meaning
- Brief explanation (1-2 sentences)

### Examples
- Example 1 simple sentence
- Example 2 (if applicable) simple sentence

Note: Use simple, easy-to-understand language and avoid technical terms. If the word has a slang meaning, please include it in the explanation.
Answer in ${supabaseUser?.interfaceLanguage?.nameEn}.
`;

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