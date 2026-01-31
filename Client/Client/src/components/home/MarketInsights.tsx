import { BookOpen } from "lucide-react";
import { Page } from "../../App";
import { useEffect, useState } from "react";
import api from "../../api";

interface MarketInsightsProps {
  setCurrentPage: (page: Page) => void;
}

export function MarketInsights({ setCurrentPage }: MarketInsightsProps) {
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(() => {
    let mounted = true;
    api.get('/api/articles/').then((data) => {
      if (!mounted) return;
      setArticles(data || []);
    }).catch((err) => console.error(err));
    return () => { mounted = false };
  }, []);
  return (
    <section className="py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-royal-blue mb-4 font-montserrat" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Real Estate Insights
          </h2>
          <p className="text-slate font-inter" style={{ fontSize: '1.125rem' }}>
            Guides, updates, and expert advice on the Cameroonian property market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {articles.map((article, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl border border-gray-200 hover:border-gold hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setCurrentPage("blog")}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-royal-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-royal-blue" />
                </div>
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-gold/20 text-royal-blue rounded-full text-xs font-inter mb-3" style={{ fontWeight: 600 }}>
                    {article.category}
                  </div>
                  <h3 className="text-royal-blue mb-2 font-montserrat" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {article.title}
                  </h3>
                  <p className="text-slate font-inter text-sm">{article.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentPage("blog")}
            className="inline-flex items-center px-8 py-3 bg-royal-blue text-white rounded-lg hover:bg-gold hover:text-royal-blue transition-all shadow-lg font-inter"
            style={{ fontWeight: 600 }}
          >
            Read All Insights →
          </button>
        </div>
      </div>
    </section>
  );
}
