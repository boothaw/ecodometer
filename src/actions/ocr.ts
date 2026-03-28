"use server";

import Anthropic from "@anthropic-ai/sdk";



export async function ocrMiles(base64: String, mimeType: string) {
    // userId would need another call to DB is this needed?
    // const { userId } = await auth();
    // if (!userId) throw new Error("Unauthorized");

    const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env automatically


    const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 64,
        messages: [
            {
            role: "user",
            content: [
                {
                type: "image",
                source: { type: "base64", media_type: mimeType, data: imageBase64 },
                },
                {
                type: "text",
                text: "Return ONLY the odometer number as digits with no commas or spaces. Example: 47823. If unclear, respond with ERROR.",
                },
            ],
            },
        ],
    });
const text = (message.content[0] as { text: string }).text.trim();
if (/^\d+$/.test(text)) {
  return { miles: parseInt(text, 10) };
}
return { error: "Could not read odometer" };
}