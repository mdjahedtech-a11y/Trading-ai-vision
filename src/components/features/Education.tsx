import React, { useState } from 'react';
import { useApp } from '@/store/app-context';
import { Card } from '@/components/ui/shared';
import { BookOpen, ChevronRight, PlayCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

// Static Data for Candlestick Patterns
const PATTERNS = [
  {
    id: 'hammer',
    name: 'Hammer',
    type: 'Bullish Reversal',
    desc: 'Indicates a potential price reversal to the upside after a downtrend.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/hammer-candlestick-pattern.png',
    videoId: '9Y2iaW3SFpo',
    details: {
      meaning: 'The Hammer is a bullish reversal pattern that forms after a decline. It has a small real body and a long lower shadow, indicating that sellers pushed prices down, but buyers rejected the lower prices and pushed it back up.',
      example: 'Found at the bottom of a downtrend. If the next candle is bullish, it confirms the reversal.',
      action: 'Buy / Long',
      stopLoss: 'Below the low of the hammer candle.',
    },
    color: 'emerald'
  },
  {
    id: 'shooting-star',
    name: 'Shooting Star',
    type: 'Bearish Reversal',
    desc: 'A bearish reversal pattern that forms after an advance.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/shooting-star-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'The Shooting Star is a bearish reversal pattern. It has a small real body and a long upper shadow, indicating that buyers pushed prices up, but sellers rejected the higher prices and pushed it back down.',
      example: 'Found at the top of an uptrend. Indicates potential selling pressure.',
      action: 'Sell / Short',
      stopLoss: 'Above the high of the shooting star candle.',
    },
    color: 'rose'
  },
  {
    id: 'doji',
    name: 'Doji',
    type: 'Indecision',
    desc: 'Represents market indecision where open and close prices are virtually equal.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/doji-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'A Doji forms when the open and close prices are virtually the same. It signals indecision in the market—neither buyers nor sellers are in control.',
      example: 'Often found at market tops or bottoms. Requires confirmation from the next candle.',
      action: 'Wait for Confirmation',
      stopLoss: 'Above/Below the high/low of the Doji.',
    },
    color: 'yellow'
  },
  {
    id: 'engulfing-bullish',
    name: 'Bullish Engulfing',
    type: 'Bullish Reversal',
    desc: 'A large green candle that completely engulfs the previous red candle.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bullish-engulfing-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'This pattern consists of two candles. The first is a small bearish candle, followed by a large bullish candle that completely "engulfs" the body of the previous one. It shows buyers have taken control.',
      example: 'Strong signal at support levels.',
      action: 'Buy / Long',
      stopLoss: 'Below the low of the engulfing candle.',
    },
    color: 'emerald'
  },
  {
    id: 'engulfing-bearish',
    name: 'Bearish Engulfing',
    type: 'Bearish Reversal',
    desc: 'A large red candle that completely engulfs the previous green candle.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bearish-engulfing-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'The opposite of the Bullish Engulfing. A small bullish candle is followed by a large bearish candle that engulfs it. It shows sellers have overwhelmed buyers.',
      example: 'Strong signal at resistance levels.',
      action: 'Sell / Short',
      stopLoss: 'Above the high of the engulfing candle.',
    },
    color: 'rose'
  },
  {
    id: 'morning-star',
    name: 'Morning Star',
    type: 'Bullish Reversal',
    desc: 'A three-candle pattern signaling a reversal from a downtrend.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/morning-star-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'Consists of a large bearish candle, a small-bodied candle (star), and a large bullish candle. It indicates that selling pressure is subsiding and buyers are taking control.',
      example: 'Found at the bottom of a downtrend. The third candle confirms the reversal.',
      action: 'Buy / Long',
      stopLoss: 'Below the low of the middle candle (star).',
    },
    color: 'emerald'
  },
  {
    id: 'evening-star',
    name: 'Evening Star',
    type: 'Bearish Reversal',
    desc: 'A three-candle pattern signaling a reversal from an uptrend.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/evening-star-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'The opposite of the Morning Star. A large bullish candle, a small-bodied candle, and a large bearish candle. It indicates that buying momentum is fading and sellers are stepping in.',
      example: 'Found at the top of an uptrend. The third candle confirms the reversal.',
      action: 'Sell / Short',
      stopLoss: 'Above the high of the middle candle (star).',
    },
    color: 'rose'
  },
  {
    id: 'bullish-harami',
    name: 'Bullish Harami',
    type: 'Bullish Reversal',
    desc: 'A small green candle contained within the previous large red candle.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bullish-harami-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'A large bearish candle is followed by a smaller bullish candle that fits entirely within the body of the previous candle. It suggests that the selling pressure is weakening.',
      example: 'Indicates a potential trend change when found in a downtrend.',
      action: 'Buy / Long (Wait for confirmation)',
      stopLoss: 'Below the low of the previous bearish candle.',
    },
    color: 'emerald'
  },
  {
    id: 'bearish-harami',
    name: 'Bearish Harami',
    type: 'Bearish Reversal',
    desc: 'A small red candle contained within the previous large green candle.',
    image: 'https://a.c-dn.net/c/content/dam/publicsites/igcom/uk/images/ContentImage/bearish-harami-candlestick-pattern.png',
    videoId: 'XqVvWqKqWqI', // Placeholder
    details: {
      meaning: 'A large bullish candle is followed by a smaller bearish candle that fits entirely within the body of the previous candle. It suggests that the buying momentum is stalling.',
      example: 'Indicates a potential trend change when found in an uptrend.',
      action: 'Sell / Short (Wait for confirmation)',
      stopLoss: 'Above the high of the previous bullish candle.',
    },
    color: 'rose'
  }
];

export function Education() {
  const { language } = useApp();
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const handleSelect = (patternId: string) => {
    setSelectedPattern(selectedPattern === patternId ? null : patternId);
  };

  const getIcon = (type: string) => {
    if (type.includes('Bullish')) return <TrendingUp className="w-5 h-5 text-emerald-400" />;
    if (type.includes('Bearish')) return <TrendingDown className="w-5 h-5 text-rose-400" />;
    return <Minus className="w-5 h-5 text-yellow-400" />;
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'rose': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default: return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          {language === 'en' ? 'Master Patterns' : 'প্যাটার্ন মাস্টার'}
        </h2>
      </div>

      <div className="grid gap-4">
        {PATTERNS.map((pattern) => (
          <Card 
            key={pattern.id}
            className={cn(
              "cursor-pointer transition-all overflow-hidden border-l-4",
              selectedPattern === pattern.id ? "bg-zinc-800 ring-1 ring-white/10" : "hover:bg-zinc-800/50",
              pattern.color === 'emerald' ? "border-l-emerald-500" : 
              pattern.color === 'rose' ? "border-l-rose-500" : "border-l-yellow-500"
            )}
            onClick={() => handleSelect(pattern.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border", getColorClass(pattern.color))}>
                  <img src={pattern.image} alt={pattern.name} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{pattern.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider opacity-60 flex items-center gap-1">
                    {getIcon(pattern.type)}
                    {pattern.type}
                  </p>
                </div>
              </div>
              <ChevronRight className={cn("w-5 h-5 text-zinc-600 transition-transform duration-300", selectedPattern === pattern.id && "rotate-90")} />
            </div>

            <AnimatePresence>
              {selectedPattern === pattern.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="pt-6 mt-4 border-t border-white/5 space-y-6">
                    
                    {/* Image & Description */}
                    <div className="relative rounded-xl overflow-hidden bg-black/20 border border-white/5">
                      <img src={pattern.image} alt={pattern.name} className="w-full h-48 object-contain p-4" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-sm text-zinc-200">{pattern.desc}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                        <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">Meaning</h4>
                        <p className="text-zinc-300 text-sm leading-relaxed">{pattern.details.meaning}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                          <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Action</h4>
                          <span className={cn("text-sm font-bold", pattern.color === 'emerald' ? "text-emerald-400" : pattern.color === 'rose' ? "text-rose-400" : "text-yellow-400")}>
                            {pattern.details.action}
                          </span>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                          <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Stop Loss</h4>
                          <span className="text-sm text-zinc-300">{pattern.details.stopLoss}</span>
                        </div>
                      </div>
                    </div>

                    {/* Video Section */}
                    <div className="rounded-xl overflow-hidden border border-white/5 bg-black">
                      <div className="flex items-center gap-2 p-3 border-b border-white/5 bg-zinc-900/50">
                        <PlayCircle className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-medium text-zinc-400">Video Tutorial</span>
                      </div>
                      <div className="aspect-video bg-zinc-900 relative">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${pattern.videoId}`}
                          title={pattern.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0"
                        />
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  );
}
