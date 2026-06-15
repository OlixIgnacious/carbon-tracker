import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { summary } = await request.json();

    if (!summary) {
      return Response.json({ error: 'Missing summary data' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, return fallback signal
    if (!apiKey) {
      return Response.json({ useFallback: true }, { status: 200 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a friendly, knowledgeable sustainability advisor. Based on the following user's carbon footprint data, provide 5 specific, actionable, and realistic recommendations to reduce their emissions.

USER'S CARBON FOOTPRINT DATA:
${summary}

IMPORTANT RULES:
- Be specific and practical, not generic
- Reference the user's actual data in your suggestions
- Include estimated CO2e savings for each recommendation
- Rate each recommendation's difficulty as "easy", "medium", or "hard"
- Focus on the highest-emission areas first

Respond in VALID JSON format only, with no markdown or explanation:
{
  "recommendations": [
    {
      "title": "Short action title",
      "description": "Detailed, actionable explanation (2-3 sentences)",
      "estimatedSavingKgCO2e": <number>,
      "difficulty": "easy" | "medium" | "hard",
      "category": "transport" | "energy" | "food" | "general"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ useFallback: true }, { status: 200 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json(parsed, { status: 200 });
  } catch (error) {
    console.error('Insights API error:', error);
    return Response.json({ useFallback: true }, { status: 200 });
  }
}
