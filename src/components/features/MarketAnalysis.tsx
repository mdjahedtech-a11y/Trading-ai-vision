import React, { useState } from 'react';
import { useApp } from '@/store/app-context';
import { GeminiService } from '@/services/gemini';
import { Button, Card } from '@/components/ui/shared';
import { PairAnalysisResult } from '@/types';
import { Search, Loader2, ArrowRight, Target, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function MarketAnalysis() {
  const { language } = useApp();
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PairAnalysisResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await GeminiService.analyzePair(symbol, language);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ['EURUSD', 'BTCUSD', 'XAUUSD', 'GBPUSD'];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {language === 'en' ? 'Market Scanner' : 'মার্কেট স্ক্যানার'}
        </h2>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder={language === 'en' ? "Search symbol (e.g. BTCUSD)..." : "সিম্বল খুঁজুন (যেমন BTCUSD)..."}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <Button 
          type="submit" 
          disabled={loading || !symbol}
          className="absolute right-2 top-2 bottom-2 py-0 px-4 rounded-lg"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </Button>
      </form>

      {!result && !loading && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className="px-3 py-1.5 rounded-full bg-zinc-800 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card gradient className="border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-3xl font-bold text-white tracking-tight">{result.symbol}</h3>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                result.trend === 'Bullish' ? "bg-emerald-500/20 text-emerald-400" :
                result.trend === 'Bearish' ? "bg-rose-500/20 text-rose-400" :
                "bg-yellow-500/20 text-yellow-400"
              )}>
                {result.trend}
              </span>
            </div>
            <p className="text-zinc-400 text-sm">{result.explanation}</p>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-zinc-900/50">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-indigo-400 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">Scenario</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{result.scenario}</p>
                </div>
              </div>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase mb-2">Support</p>
                {result.support.map((s, i) => (
                  <div key={i} className="font-mono text-emerald-400 font-medium">{s}</div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase mb-2">Resistance</p>
                {result.resistance.map((r, i) => (
                  <div key={i} className="font-mono text-rose-400 font-medium">{r}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
