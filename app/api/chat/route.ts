import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!googleApiKey) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
      return new Response(
        JSON.stringify({
          error: "Server configuration error: Google AI API key is missing.",
          details:
            "Please ensure GOOGLE_GENERATIVE_AI_API_KEY is set in your environment variables.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { messages, pdfContent } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const coreMessages = convertToCoreMessages(messages);

    // System prompt that encourages proper bold usage for important topics/headings
    let systemPrompt = `You are a helpful, knowledgeable, and friendly AI assistant. Provide comprehensive, detailed, and well-structured responses that fully address the user's questions.

Formatting Guidelines:
- Provide thorough and detailed answers - don't be overly brief
- Use **bold** for section headings, important topics, key concepts, and terms that need emphasis
- Use simple bullet points with hyphens (-) for lists
- Use numbered lists (1., 2., 3.) when order matters
- Use *italics* occasionally for subtle emphasis or foreign terms
- Make your responses comprehensive and informative while using proper Markdown formatting
- Bold formatting should help organize content and highlight important information
`;

    if (pdfContent) {
      systemPrompt = `You are a helpful AI assistant specialized in document analysis. You have access to the content of a PDF document that the user has uploaded.

PDF Document Content:
${pdfContent}

Instructions:
- Provide detailed, comprehensive answers based on the PDF content when relevant
- Reference specific sections, pages, or quotes from the PDF when applicable  
- If a question cannot be fully answered from the PDF, clearly state this and provide additional helpful context from your general knowledge
- Be thorough in your analysis and explanations - users want detailed insights
- Explain concepts, provide context, and offer comprehensive information

Formatting Guidelines:
- Use **bold** for section headings, key topics from the PDF, important concepts, and terms that need emphasis
- Use simple bullet points with hyphens (-) for lists
- Use numbered lists (1., 2., 3.) when showing steps or ordered information
- Use *italics* occasionally for document titles, subtle emphasis, or technical terms
- Structure your response with clear headings and proper formatting
- Bold formatting should help organize the content and make important information stand out
- Prioritize detailed, helpful content with proper visual structure
`;
    }

    // Add system message to the beginning
    const messagesWithSystem = [
      { role: "system" as const, content: systemPrompt },
      ...coreMessages,
    ];

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: messagesWithSystem,
      temperature: 0.7,
      maxTokens: 4000, // Increased token limit for more detailed responses
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);

    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: "Failed to process your request",
          details: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
