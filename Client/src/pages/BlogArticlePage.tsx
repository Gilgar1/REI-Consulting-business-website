import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { useArticle } from "../hooks/useArticles";

export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading, error } = useArticle(slug || "");

  if (loading) return <div className="pt-32 text-center text-gray-500">Loading…</div>;

  if (error || !article) {
    return (
      <div className="pt-32 text-center">
        <p className="text-gray-500 mb-4">This article doesn't exist or isn't published.</p>
        <Link to="/blog" className="text-accent">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-slate-300 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          <span className="px-3 py-1 bg-accent text-white rounded-full text-sm">{article.category}</span>
          <h1 className="text-white mt-4 mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-slate-300 text-sm">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </section>

      {article.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <img src={article.image} alt={article.title} className="w-full h-80 object-cover rounded-xl shadow-lg" />
        </div>
      )}

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate">
          {article.content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-5 text-gray-700 leading-relaxed">{para}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
