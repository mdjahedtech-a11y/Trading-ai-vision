import React, { useState } from 'react';
import { useApp } from '@/store/app-context';
import { LayoutDashboard, ScanLine, BookOpen, Settings } from 'lucide-react';
import { ChartAnalysis } from '@/components/features/ChartAnalysis';
import { MarketAnalysis } from '@/components/features/MarketAnalysis';
import { Education } from '@/components/features/Education';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'chart' | 'market' | 'learn';

export default function MainLayout() {
  const { language, toggleLanguage } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('chart');

  const tabs = [
    { id: 'chart', icon: ScanLine, label: language === 'en' ? 'Vision' : 'ভিশন' },
    { id: 'market', icon: LayoutDashboard, label: language === 'en' ? 'Market' : 'মার্কেট' },
    { id: 'learn', icon: BookOpen, label: language === 'en' ? 'Learn' : 'শিখুন' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">TradeSight</h1>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {language === 'en' ? 'BN' : 'EN'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'chart' && <ChartAnalysis />}
            {activeTab === 'market' && <MarketAnalysis />}
            {activeTab === 'learn' && <Education />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/5 pb-safe">
        <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className="relative flex flex-col items-center gap-1.5 p-2"
              >
                <div className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-zinc-500 hover:text-zinc-300"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-white" : "text-zinc-600"
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
