import React, { useState } from 'react';
import { useApp } from '@/store/app-context';
import { GeminiService } from '@/services/gemini';
import { ImageUpload } from './ImageUpload';
import { Button, Card } from '@/components/ui/shared';
import { AnalysisResult } from '@/types';
import { Loader2, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function ChartAnalysis() {
  const { language } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await GeminiService.analyzeChart(image, language);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze chart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Bullish': return <TrendingUp className="w-6 h-6 text-emerald-500" />;
      case 'Bearish': return <TrendingDown className="w-6 h-6 text-rose-500" />;
      default: return <Minus className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Bullish': return 'text-emerald-400';
      case 'Bearish': return 'text-rose-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {language === 'en' ? 'Chart Vision' : 'চার্ট ভিশন'}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {language === 'en' ? 'Upload a chart to get AI insights' : 'AI বিশ্লেষণের জন্য চার্ট আপলোড করুন'}
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
          AI POWERED
        </span>
      </div>

      <ImageUpload 
        selectedImage={image} 
        onImageSelect={(img) => { setImage(img); setResult(null); }} 
        onClear={() => { setImage(null); setResult(null); }} 
      />

      {image && !result && !loading && (
        <Button onClick={handleAnalyze} className="w-full py-4 text-lg">
          {language === 'en' ? 'Analyze Chart' : 'চার্ট বিশ্লেষণ করুন'}
        </Button>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-zinc-400 animate-pulse">
            {language === 'en' ? 'AI is analyzing market structure...' : 'এআই মার্কেট স্ট্রাকচার বিশ্লেষণ করছে...'}
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Trend Card */}
          <Card gradient className="border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getTrendIcon(result.trend)}
                <div>
                  <p className="text-sm text-zinc-400 uppercase tracking-wider">Market Trend</p>
                  <h3 className={cn("text-2xl font-bold", getTrendColor(result.trend))}>
                    {result.trend}
                  </h3>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Confidence</p>
                <div className="flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xl font-mono font-bold text-white">{result.confidence}%</span>
                </div>
              </div>
            </div>
            <p className="text-zinc-300 leading-relaxed border-t border-white/5 pt-4">
              {result.insight}
            </p>
          </Card>

          {/* Levels Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-emerald-900/10 border-emerald-500/20">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2">Support Levels</p>
              <div className="space-y-1">
                {result.support_levels.map((level, i) => (
                  <div key={i} className="font-mono text-lg text-white font-medium">
                    {level}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="bg-rose-900/10 border-rose-500/20">
              <p className="text-xs text-rose-400 uppercase tracking-wider mb-2">Resistance Levels</p>
              <div className="space-y-1">
                {result.resistance_levels.map((level, i) => (
                  <div key={i} className="font-mono text-lg text-white font-medium">
                    {level}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Zones Explanation */}
          <Card>
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Key Zones Analysis
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {result.zones_explanation}
            </p>
          </Card>

          <p className="text-xs text-zinc-600 text-center mt-8">
            {result.disclaimer}
          </p>
        </motion.div>
      )}
    </div>
  );
}
