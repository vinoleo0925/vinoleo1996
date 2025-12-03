import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsCard from './components/NewsCard';
import CategoryFilter from './components/CategoryFilter';
import Footer from './components/Footer';
import { fetchDailyNews } from './services/newsService';
import { NewsResponse, CategoryFilter as CatEnum, Language } from './types';
import { AlertCircle } from 'lucide-react';

const translations = {
  en: {
    latestIntel: "Latest Intelligence",
    reports: "Reports",
    scanning: "Scanning...",
    noReports: "No reports found for this category today.",
    loadingError: "Failed to load news.",
    missingKey: "API Key is missing. Please set process.env.API_KEY"
  },
  zh: {
    latestIntel: "最新情报",
    reports: "篇报告",
    scanning: "扫描中...",
    noReports: "今日该分类暂无报告。",
    loadingError: "加载新闻失败。",
    missingKey: "缺少 API Key。请设置 process.env.API_KEY"
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CatEnum>(CatEnum.ALL);
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  const loadNews = useCallback(async (lang: Language) => {
    setLoading(true);
    setError(null);
    try {
      if (!process.env.API_KEY) {
         throw new Error(translations[lang].missingKey);
      }
      const result = await fetchDailyNews(lang);
      setData(result);
    } catch (err: any) {
      setError(err.message || translations[lang].loadingError);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNews(language);
  }, []);

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    loadNews(newLang);
  };

  const filteredNews = data?.newsItems.filter(item => {
    if (selectedCategory === CatEnum.ALL) return true;
    return item.category === selectedCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <Header 
        onRefresh={() => loadNews(language)} 
        isRefreshing={loading} 
        language={language}
        onToggleLanguage={handleLanguageToggle}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-3">
             <AlertCircle className="h-5 w-5" />
             <span>{error}</span>
          </div>
        )}

        <section className="mb-12">
           <Hero summary={data?.dailySummary || null} loading={loading} language={language} />
        </section>

        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {t.latestIntel}
                <span className="text-xs font-normal text-slate-500 bg-slate-900 border border-slate-800 px-2 py-1 rounded-full">
                  {loading ? t.scanning : `${filteredNews.length} ${language === 'en' ? 'Reports' : ''}${language === 'zh' ? '篇' : ''}`}
                </span>
              </h2>
            </div>
            <CategoryFilter 
              selected={selectedCategory} 
              onSelect={setSelectedCategory} 
              language={language}
            />
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-96 bg-slate-900/50 rounded-xl animate-pulse border border-slate-800"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <NewsCard key={item.id} item={item} language={language} />
              ))}
              {filteredNews.length === 0 && !error && (
                <div className="col-span-full py-20 text-center text-slate-500">
                  {t.noReports}
                </div>
              )}
            </div>
          )}
        </section>

      </main>

      <Footer language={language} />
    </div>
  );
};

export default App;