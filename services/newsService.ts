import { GoogleGenAI } from "@google/genai";
import { NewsResponse, Language } from "../types";

// Helper to clean up markdown code blocks and conversational text
const cleanJsonString = (str: string): string => {
  // 1. Remove markdown wrappers if present
  let cleaned = str.replace(/^```json\s*/, '').replace(/^```\s*/, '');
  cleaned = cleaned.replace(/\s*```$/, '');

  // 2. Find the first '{' and the last '}' to handle conversational preambles
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

export const fetchDailyNews = async (lang: Language): Promise<NewsResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Get detailed date info for the prompt
    const now = new Date();
    const todayFull = now.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const langInstruction = lang === 'zh' 
      ? "Output JSON content in Simplified Chinese (titles, summaries, keyPoints, trends). However, the 'category' field values MUST remain in English (e.g., 'Tech Giant')." 
      : "Output JSON content in English.";

    const prompt = `
      Current Date/Time: ${todayFull} (${now.toISOString()}).

      Act as a specialized "AI & Robotics Intelligence Analyst".
      
      YOUR MISSION:
      Search for and summarize the **LATEST BREAKING NEWS** from the **LAST 24 HOURS ONLY**.
      
      SEARCH TARGETS:
      1. **YouTube & Interviews (Tech Giants)**: Latest interviews/talks released **today/yesterday** from: Jensen Huang, Sam Altman, Elon Musk, Demis Hassabis, Andrej Karpathy.
      2. **Humanoid Robotics**: New demos or announcements **last 24h** from: Tesla Optimus, Figure AI, Unitree, 1X, Agility Robotics, Boston Dynamics.
      3. **Research & Papers (Hugging Face / Arxiv)**: 
         - Search **Hugging Face Daily Papers** for the most popular papers trending **TODAY**.
         - Focus on: **Agents, Humanoid Robotics, RL (Reinforcement Learning), VLA (Vision-Language-Action), LLM, and VLN**.
         - Summarize the *core innovation* and technical novelty.
      4. **Open Source (GitHub)**:
         - Search **GitHub Trending** for repositories related to **AI Agents** or **Robotics** that are trending **today**.

      STRICT CONSTRAINTS:
      1. **TIME**: CONTENT MUST BE FROM THE LAST 24 HOURS. If a paper was published a month ago but is trending *today*, you may include it, but note that it is "Trending Today".
      2. **ACCURACY**: Extract the **EXACT** publish time if possible.
      3. **FORMAT**: Return ONLY valid JSON.
      
      JSON STRUCTURE:
      {
        "dailySummary": {
          "headline": "Headline covering the biggest event of the last 24h",
          "overview": "Brief high-level summary of today's key movements in AI/Robotics.",
          "topTrends": ["Trend 1", "Trend 2", "Trend 3"]
        },
        "newsItems": [
          {
            "id": "unique_id_1",
            "title": "Title of the video/article/paper",
            "source": "e.g., 'Hugging Face Daily Papers', 'GitHub Trending', 'YouTube - NVIDIA'",
            "category": "One of: 'Tech Giant', 'Humanoid Robot', 'Embodied AI', 'Research'",
            "summary": "Core summary. For Papers/Code: Explain the problem solved and the specific method used (e.g., 'Used PPO with...').",
            "keyPoints": ["Key Insight 1", "Key Insight 2", "Key Insight 3"],
            "technicalTrend": "Specific tech detail (e.g., 'VLA Model Architecture', 'Sim-to-Real')",
            "url": "The SPECIFIC URL found in search",
            "timestamp": "Exact time (e.g., '14:30 Today', '3 hours ago')"
          }
        ]
      }

      ${langInstruction}
      
      EXECUTION:
      - Use the 'googleSearch' tool to find real-time data.
      - Verify the dates. 
      - If you find fewer than 6 items from the *last 24 hours*, that is okay, but prioritize quality and recency over quantity. Try to find at least 4-5 high-quality items.
    `;

    // Note: We cannot use 'responseSchema' together with 'tools' in the current API version for some models,
    // so we rely on the prompt to enforce JSON structure and parse the text manually.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We do not set responseMimeType to json when using tools.
      },
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No content generated");
    }

    try {
      const cleanedJson = cleanJsonString(textResponse);
      const data = JSON.parse(cleanedJson) as NewsResponse;
      
      if (!data.dailySummary || !Array.isArray(data.newsItems)) {
        throw new Error("Invalid JSON structure");
      }
      
      return data;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw Text:", textResponse);
      throw new Error("Failed to parse AI response");
    }

  } catch (error) {
    console.error("Failed to fetch news:", error);
    const isZh = lang === 'zh';
    return {
      dailySummary: {
        headline: isZh ? "获取实时新闻失败" : "Failed to Fetch Live News",
        overview: isZh ? "请检查您的网络连接或 API Key 设置。" : "Please check your network connection or API Key settings.",
        topTrends: isZh ? ["连接错误"] : ["Connection Error"]
      },
      newsItems: []
    };
  }
};