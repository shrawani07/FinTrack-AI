import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, context } = body;

    // Validate message
    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required",
        },
        { status: 400 }
      );
    }

    // AI Response
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",

      messages: [
        {
          role: "system",
          content: `
You are a smart financial advisor.

User financial data:
${JSON.stringify(context)}

Your job:
- Analyze spending habits
- Give savings advice
- Suggest budgeting improvements
- Keep answers short and practical
- Respond like a helpful finance assistant
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: Date.now().toString(),
        role: "assistant",
        content:
          completion.choices[0].message.content ||
          "No response generated.",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("OPENROUTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message || "Failed to generate AI response",
      },
      { status: 500 }
    );
  }
}