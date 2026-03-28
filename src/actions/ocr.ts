"use server";

import Anthropic from "@anthropic-ai/sdk";
import { spec } from "node:test/reporters";
import { auth } from "@clerk/nextjs/server";


export async function ocrMiles(base64: string, mimeType: string) {
    console.log('occcrrrrr!!!!')
    // console.log('base', base64)
    // console.log('mime', mimeType)


    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const client = new Anthropic(); 

    const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 64,
        messages: [
            {
            role: "user",
            content: [
                {
                type: "image",
                source: { type: "base64", media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 },
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