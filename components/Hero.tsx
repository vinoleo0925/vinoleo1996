import React from 'react';
import { DailySummary, Language } from '../types';
import { Sparkles, TrendingUp } from 'lucide-react';

interface HeroProps {
  summary: DailySummary | null;
  loading: boolean;
  language: Language;
}

const Hero: React.FC<HeroProps> = ({ summary, loading, language }) => {
  const t = {
    dailyBrief: language === 'zh' ? '每日简报' : 'Daily Briefing',
    trend: language === 'zh' ? '趋势' : 'Trend'
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800 p-8 flex flex-col justify-center gap-4">
        <div className="h-8 bg-slate-800 rounded w-2/3"></div>
        <div className="h-4 bg-slate-800 rounded w-full"></div>
        <div className="h-4 bg-slate-800 rounded w-4/5"></div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-2xl">
      <div className="absolute top-0 right-0 p-32 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative p-6 sm:p-10">
        <div className="flex items-center gap-2 text-indigo-400 mb-4 font-semibold tracking-wider text-sm uppercase">
          <Sparkles className="h-4 w-4" />
          <span>{t.dailyBrief}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          {summary.headline}
        </h2>

        <p className="text-lg text-slate-300 mb-8 max-w-3xl leading-relaxed">
          {summary.overview}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
          {summary.topTrends.map((trend, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 p-1 rounded bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block mb-1">
                  {t.trend} 0{idx + 1}
                </span>
                <span className="text-slate-200 font-medium text-sm">
                  {trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;