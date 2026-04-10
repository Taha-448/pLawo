/**
 * aiService.js
 * Professional Artificial Intelligence Legal Connector for pLawo
 * Uses the latest Gemini 2.x API for comprehensive, non-hardcoded legal analysis.
 */

const getLegalCategory = async (problemDescription) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  // REST API configuration - Using Gemini 2.0 Flash (Stable & Fast)
  // This model is explicitly listed as available for your API key
  const MODEL_ID = "gemini-2.0-flash"; 
  const REST_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

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

    const response = await fetch(REST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Extract and parse JSON
    try {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      }
      return JSON.parse(text);
    } catch (parseError) {
      console.error("AI response could not be parsed as JSON:", text);
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
