import React from 'react';
import { CategoryFilter as CatEnum, Language } from '../types';

interface CategoryFilterProps {
  selected: CatEnum;
  onSelect: (category: CatEnum) => void;
  language: Language;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect, language }) => {
  const categories = Object.values(CatEnum);

  const getLabel = (cat: CatEnum) => {
    if (language === 'en') return cat;
    switch (cat) {
      case CatEnum.ALL: return '全部';
      case CatEnum.TECH_GIANT: return '科技巨头';
      case CatEnum.HUMANOID: return '人形机器人';
      case CatEnum.EMBODIED_AI: return '具身智能';
      case CatEnum.RESEARCH: return '前沿研究';
      default: return cat;
    }
  };

  return (
    <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`
            whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
            ${selected === cat 
              ? 'bg-white text-slate-950 border-white shadow-lg shadow-white/10' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'}
          `}
        >
          {getLabel(cat)}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;