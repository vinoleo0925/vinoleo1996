import React from 'react';
import { RotateCcw, Cpu, Languages } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  language: Language;
  onToggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing, language, onToggleLanguage }) => {
  const today = new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                RoboPulse
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                {language === 'zh' ? 'AI 与 机器人情报' : 'AI & ROBOTICS INTELLIGENCE'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-slate-400">{today}</span>
            </div>

            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800 hover:border-indigo-500/50 hover:text-white transition-all"
            >
              <Languages className="h-4 w-4" />
              <span>{language === 'en' ? 'EN' : '中'}</span>
            </button>

            <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 ${isRefreshing ? 'animate-spin' : ''}`}
              title={language === 'zh' ? "刷新" : "Refresh"}
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;