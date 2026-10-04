import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { useArticles } from "../hooks/useArticles";

const categories = [
  "All Articles",
  "Market Insights",
  "Loan Guidance",
  "Documentation",
  "Diaspora Investment",
  "Property Verification",
  "Case Studies"
];

export function BlogPage() {
  const { articles, loading, error } = useArticles();
  const [activeCategory, setActiveCategory] = useState("All Articles");

  const filtered = activeCategory === "All Articles"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  return (
    <div className="pt-16">
      <section className="py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">Market Insights & Guidance</h1>
          <p className="text-slate-300 text-xl">
            Expert knowledge to help you make smarter real estate decisions
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeCategory === category
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-[400px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <p className="text-center text-gray-500">Loading articles…</p>
          )}

          {error && (
            <p className="text-center text-red-600">
              Couldn't load articles right now. Please try again shortly.
            </p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-500">No articles in this category yet.</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow block"
                >
                  {article.image && (
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-amber-100 text-accent rounded-full text-sm">
                        {article.category}
                      </span>
                    </div>

                    <h3 className="text-gray-900 mb-3">{article.title}</h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <span>{article.readTime}</span>
                    </div>

                    <span className="flex items-center text-accent">
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-primary rounded-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white mb-4">Stay Informed</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Get the latest real estate insights, market analysis, and investment guidance delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
