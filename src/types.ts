export type Language = 'en' | 'bn';

export interface AnalysisResult {
  trend: 'Bullish' | 'Bearish' | 'Sideways';
  confidence: number;
  support_levels: number[];
  resistance_levels: number[];
  insight: string;
  zones_explanation: string;
  disclaimer: string;
}

export interface PairAnalysisResult {
  symbol: string;
  trend: 'Bullish' | 'Bearish' | 'Sideways';
  support: string[];
  resistance: string[];
  scenario: string;
  explanation: string;
}

export interface CandlestickPattern {
  id: string;
  name: string;
  description: string;
  image?: string;
}
