"use server";

import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function ocrMiles(imageBase64: string) {
  const result = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_tokens: 64,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
          {
            type: "text",
            text: "Return ONLY the odometer number as digits with no commas or spaces. Example: 47823. If unclear, respond with ERROR.",
          },
        ],
      },
    ],
  });

  const text = result.choices[0].message.content?.trim() ?? "";
  if (/^\d+$/.test(text)) {
    return { miles: parseInt(text, 10) };
  }
  return { error: "Could not read odometer" };
}
