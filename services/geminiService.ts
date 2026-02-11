import { GoogleGenAI, Type } from "@google/genai";
import { AwardData, MovieDetails } from "../types";

// Lazy-initialize the AI client to prevent top-level crashes if API_KEY is missing/invalid
let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiInstance) {
    const key = process.env.API_KEY;
    // We provide a fallback string only to prevent the constructor from throwing immediately.
    // The actual API call will fail with a 401 if the key is 'MISSING', which we handle in the UI.
    aiInstance = new GoogleGenAI({ apiKey: key && key !== "undefined" ? key : 'MISSING' });
  }
  return aiInstance;
};

/**
 * Fetches award data with strict verification of official status using Search Grounding.
 * Caches results in localStorage to avoid redundant searches.
 */
export const fetchAwardData = async (awardName: string, year: number): Promise<AwardData> => {
  const cacheKey = `award_data_${awardName.toLowerCase().replace(/\s+/g, '_')}_${year}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const parsedCache = JSON.parse(cached);
      if (Date.now() - parsedCache.lastUpdated < 86400000) {
        return parsedCache;
      }
    } catch (e) {
      console.warn('Award cache invalid');
    }
  }

  const ai = getAI();
  const prompt = `Task: Retrieve the data for the ${awardName} in the year ${year}.

  STRICT OPERATING PROCEDURES:
  1. DATA CATEGORIZATION:
     - 'official': Official nominations have been announced.
     - 'shortlist': Official preliminary shortlists exist.
     - 'contender': No official lists exist yet; return definitive consensus contenders for the upcoming year.
  
  2. SOURCE HIERARCHY:
     - Official sites (oscars.org, goldenglobes.com, etc).
     - Industry trades (Variety, Hollywood Reporter).

  3. RESPONSE:
     - Return valid JSON. All 20+ major categories if possible.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          year: { type: Type.NUMBER },
          announced: { type: Type.BOOLEAN },
          status: { type: Type.STRING, enum: ["official", "shortlist", "contender"] },
          dataFound: { type: Type.BOOLEAN },
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                nominees: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      movieTitle: { type: Type.STRING },
                      individualName: { type: Type.STRING },
                      isWinner: { type: Type.BOOLEAN }
                    },
                    required: ["movieTitle", "isWinner"]
                  }
                }
              },
              required: ["name", "nominees"]
            }
          }
        },
        required: ["name", "year", "announced", "status", "dataFound", "categories"]
      }
    }
  });

  const parsed = JSON.parse(response.text.trim());
  
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => ({
      title: chunk.web?.title || 'Grounding Source',
      uri: chunk.web?.uri
    }))
    .filter((s: any) => s.uri) || [];

  const data: AwardData = {
    ...parsed,
    id: `${parsed.name}-${parsed.year}-${parsed.status}`.toLowerCase().replace(/\s+/g, '-'),
    lastUpdated: Date.now(),
    sources: sources,
    categories: (parsed.categories || []).map((cat: any, cIdx: number) => ({
      ...cat,
      id: `cat-${cIdx}`,
      nominees: (cat.nominees || []).map((nom: any, nIdx: number) => ({
        ...nom,
        id: `nom-${cIdx}-${nIdx}`,
        predictionRank: 0,
        seen: false
      }))
    }))
  };

  localStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};

/**
 * Fetches movie details and caches them locally.
 * Considers year and country hints for better disambiguation.
 */
export const fetchMovieDetails = async (title: string, year?: number, country?: string): Promise<MovieDetails> => {
  const cacheKey = `movie_detail_${title.toLowerCase().replace(/\s+/g, '_')}_${year || ''}_${country || ''}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.warn('Movie detail cache invalid');
    }
  }

  const ai = getAI();
  const yearContext = year ? ` released around ${year}` : '';
  const countryContext = country ? ` produced in ${country}` : '';
  const prompt = `Provide detailed movie information for the film "${title}"${yearContext}${countryContext}. Ensure you identify the correct version of the film if multiple exist. Include director, cast, summary, rating, and year. Return JSON.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          year: { type: Type.STRING },
          director: { type: Type.STRING },
          cast: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          rating: { type: Type.STRING }
        },
        required: ["title", "year", "director", "cast", "summary", "rating"]
      }
    }
  });

  const details = JSON.parse(response.text.trim());
  const finalResult: MovieDetails = {
    ...details,
    posterUrl: `https://picsum.photos/seed/${encodeURIComponent(title)}/400/600`
  };

  localStorage.setItem(cacheKey, JSON.stringify(finalResult));
  return finalResult;
};