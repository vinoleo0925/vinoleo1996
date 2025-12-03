import React from 'react';
import { NewsItem, Language } from '../types';
import { PlayCircle, BrainCircuit, Bot, Building2, FlaskConical, ExternalLink, ChevronRight, Link as LinkIcon, Clock } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  language: Language;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, language }) => {
  const t = {
    coreInsights: language === 'zh' ? '核心观点' : 'Core Insights',
    trend: language === 'zh' ? '趋势' : 'Trend',
    source: language === 'zh' ? '来源' : 'Source'
  };
  
  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Tech Giant': return <Building2 className="h-4 w-4" />;
      case 'Humanoid Robot': return <Bot className="h-4 w-4" />;
      case 'Embodied AI': return <BrainCircuit className="h-4 w-4" />;
      default: return <FlaskConical className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
     if (language === 'en') return cat;
     switch (cat) {
       case 'Tech Giant': return '科技巨头';
       case 'Humanoid Robot': return '人形机器人';
       case 'Embodied AI': return '具身智能';
       case 'Research': return '前沿研究';
       default: return cat;
     }
  };

  const getColor = (cat: string) => {
     switch (cat) {
      case 'Tech Giant': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Humanoid Robot': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Embodied AI': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  // Generate a random placeholder image based on category if none provided
  const getImage = (cat: string) => {
    switch (cat) {
        case 'Humanoid Robot': return `https://picsum.photos/seed/robot${item.id}/400/225`;
        case 'Tech Giant': return `https://picsum.photos/seed/tech${item.id}/400/225`;
        default: return `https://picsum.photos/seed/ai${item.id}/400/225`;
    }
  }

  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-500 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
    >
      
      {/* Thumbnail Section */}
      <div className="relative aspect-video overflow-hidden bg-slate-950">
        <img 
          src={item.thumbnailUrl || getImage(item.category)} 
          alt={item.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
        
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
           <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${getColor(item.category)} backdrop-blur-sm`}>
              {getIcon(item.category)}
              {getCategoryLabel(item.category)}
           </span>
        </div>

        {/* Timestamp Badge */}
        <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur px-2 py-1 rounded-md text-xs text-white font-mono font-medium shadow-lg flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {item.timestamp}
        </div>

        {/* Overlay hover effect icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
           <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
             <ExternalLink className="h-6 w-6 text-white" />
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2 uppercase tracking-wide font-semibold">
           <PlayCircle className="h-3 w-3 text-red-500" />
           {item.source}
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-3 leading-snug group-hover:text-indigo-400 transition-colors">
          {item.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">
          {item.summary}
        </p>

        {/* Key Points */}
        <div className="mt-auto space-y-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{t.coreInsights}</h4>
          <ul className="space-y-2">
            {item.keyPoints.slice(0, 3).map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="mt-1 block h-1 w-1 rounded-full bg-indigo-500 shrink-0"></span>
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
           <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 truncate max-w-[80%]">
              <LinkIcon className="h-3 w-3 shrink-0" />
              <span className="truncate">{t.trend}: {item.technicalTrend}</span>
           </div>
           <div className="text-slate-400 group-hover:text-white transition-colors shrink-0">
             <ChevronRight className="h-5 w-5" />
           </div>
        </div>
      </div>
    </a>
  );
};

export default NewsCard;
