import { GoogleGenAI } from "@google/genai";
import { PROMPTS } from './prompts';
import { Language, AnalysisResult, PairAnalysisResult } from '../types';

// Initialize Gemini Client
// Note: In a real production app, we might want to proxy this through a backend
// to keep the API key secure, but for this requested architecture, we use client-side.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL_VISION = 'gemini-3-flash-preview'; // Optimized for multimodal understanding
const MODEL_TEXT = 'gemini-3-flash-preview'; // Optimized for search grounding and speed

export const GeminiService = {
  async analyzeChart(imageBase64: string, lang: Language): Promise<AnalysisResult> {
    try {
      const prompt = PROMPTS.chartAnalysis(lang);
      
      // Extract mime type and clean base64
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      const mimeType = matches ? matches[1] : 'image/png'; // Default to png if not found
      const cleanBase64 = matches ? matches[2] : imageBase64;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp', // Use a model known for strong vision capabilities
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType, data: cleanBase64 } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text;
      if (!text) throw new Error('No response from Gemini');
      
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText) as AnalysisResult;
    } catch (error) {
      console.error('Gemini Vision Error:', error);
      throw error;
    }
  },

  async analyzePair(symbol: string, lang: Language): Promise<PairAnalysisResult> {
    try {
      const prompt = PROMPTS.pairAnalysis(symbol, lang);
      
      const response = await ai.models.generateContent({
        model: MODEL_TEXT,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }], // Enable live search grounding
        }
      });

      const text = response.text;
      if (!text) throw new Error('No response from Gemini');

      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText) as PairAnalysisResult;
    } catch (error) {
      console.error('Gemini Text Error:', error);
      throw error;
    }
  },

  async explainPattern(pattern: string, lang: Language): Promise<any> {
    try {
      const prompt = PROMPTS.candlestickExplain(pattern, lang);
      
      const response = await ai.models.generateContent({
        model: MODEL_TEXT,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text;
      if (!text) throw new Error('No response from Gemini');

      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('Gemini Education Error:', error);
      throw error;
    }
  }
};
