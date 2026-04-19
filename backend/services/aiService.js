/**
 * aiService.js
 * Professional Artificial Intelligence Legal Connector for pLawo
 * Uses OpenAI GPT-4o-mini for comprehensive, non-hardcoded legal analysis.
 */

const OpenAI = require('openai');

const getLegalCategory = async (problemDescription) => {
  const API_KEY = process.env.OPENAI_API_KEY;
  
  if (!API_KEY) {
    console.error("OPENAI_API_KEY is missing in .env");
    return {
      category: "Other",
      analysis: "AI Analysis is currently unavailable. We've matched you with our general legal professionals.",
      applicableLaws: ["The Constitution of Pakistan, 1973"]
    };
  }

  const openai = new OpenAI({
    apiKey: API_KEY,
  });

  try {
    const prompt = `
    You are pLawo AI, a premier legal routing specialist for Pakistani law. 
    Analyze the user's problem and return a structured JSON response.

    Problem: "${problemDescription}"

    Your task:
    1. Categorize it into EXACTLY ONE of: ["Family Law", "Criminal Law", "Corporate Law", "Property Law", "Human Rights Law", "Tax Law", "Other"].
    2. Provide a 2-3 sentence empathetic summary of the legal situation from a Pakistani perspective.
    3. List 1-3 specific Pakistani laws, acts, or ordinances that are relevant.

    Response Format (STRICT JSON):
    {
      "category": "String",
      "analysis": "String",
      "applicableLaws": ["String"]
    }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional Pakistani legal assistant." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.error("AI response could not be parsed as JSON:", content);
      throw parseError;
    }

  } catch (error) {
    console.error("AI Analysis Failed:", error.message);
    // Generic professional fallback if the API is unreachable
    return {
      category: "Other",
      analysis: "We've received your query and matched you with our general legal professionals on pLawo.",
      applicableLaws: ["The Constitution of Pakistan, 1973"]
    };
  }
};

module.exports = { getLegalCategory };
