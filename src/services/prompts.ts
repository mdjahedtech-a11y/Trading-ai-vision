import { Language } from '../types';

export const PROMPTS = {
  chartAnalysis: (lang: Language) => `
    Analyze this trading chart image. You are a professional technical analyst.
    Return the response in strict JSON format without any markdown formatting.
    
    Language: ${lang === 'bn' ? 'Bangla (Bengali)' : 'English'}
    
    Output Schema:
    {
      "trend": "Bullish" | "Bearish" | "Sideways",
      "confidence": number (0-100),
      "support_levels": [number],
      "resistance_levels": [number],
      "insight": "Simple beginner-friendly explanation of what to do",
      "zones_explanation": "Brief explanation of key zones",
      "disclaimer": "Standard financial advice disclaimer in ${lang === 'bn' ? 'Bangla' : 'English'}"
    }
  `,
  
  pairAnalysis: (symbol: string, lang: Language) => `
    Analyze the currency pair/crypto symbol: ${symbol}.
    IMPORTANT: Use the Google Search tool to find the LATEST LIVE PRICE, news, and technical sentiment for right now.
    Do not rely on old training data. Base the analysis on the search results found.
    
    Return the response in strict JSON format without any markdown formatting.
    
    Language: ${lang === 'bn' ? 'Bangla (Bengali)' : 'English'}
    
    Output Schema:
    {
      "symbol": "${symbol}",
      "trend": "Bullish" | "Bearish" | "Sideways",
      "support": ["current support levels"],
      "resistance": ["current resistance levels"],
      "scenario": "Likely future movement based on live data",
      "explanation": "Explanation citing current price action/news"
    }
  `,

  candlestickExplain: (pattern: string, lang: Language) => `
    Explain the candlestick pattern: "${pattern}".
    Provide trading meaning and an example scenario.
    Return the response in strict JSON format without any markdown formatting.
    
    Language: ${lang === 'bn' ? 'Bangla (Bengali)' : 'English'}
    
    Output Schema:
    {
      "name": "${pattern}",
      "meaning": "What this pattern indicates",
      "example": "Real world example scenario",
      "action": "What traders usually do (Buy/Sell/Wait)"
    }
  `
};
