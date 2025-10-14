import { model } from "../config/gemini.js";

export const fetchOttReleases = async (timeframe = "week") => {
  const prompt = `
You are an expert OTT entertainment assistant.

List all *confirmed* OTT movie and web series releases happening ${
    timeframe === "month" ? "this month" : "this week (Monday–Sunday)"
  }.

Include only major platforms: Netflix, Amazon Prime Video, Disney+ Hotstar, Hulu, Apple TV+, SonyLIV, Zee5.

Return output strictly as a JSON array like:
[
  {
    "title": "string",
    "platform": "string",
    "genre": "string",
    "release_date": "YYYY-MM-DD"
  }
]
Do not include any extra text or markdown.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // try to parse JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonString = text.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error("❌ Error fetching OTT releases:", err);
    return [];
  }
};
