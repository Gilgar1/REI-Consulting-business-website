import { BookOpen, Calendar, ArrowRight } from "lucide-react";

const categories = [
  "All Articles",
  "Market Insights",
  "Loan Guidance",
  "Documentation",
  "Diaspora Investment",
  "Property Verification",
  "Case Studies"
];

const articles = [
  {
    title: "How Real Estate Loans Work in Cameroon (Simple Guide)",
    category: "Loan Guidance",
    excerpt: "A comprehensive breakdown of the loan process, requirements, and what you need to know before applying. Learn about CFC and other lenders, interest rates, and eligibility criteria.",
    date: "November 28, 2025",
    readTime: "8 min read"
  },
  {
    title: "7 Red Flags When Buying Land in Yaoundé",
    category: "Property Verification",
    excerpt: "Learn to identify warning signs that could save you from fraud and costly mistakes. From fake documents to disputed land, here's what to watch for.",
    date: "November 25, 2025",
    readTime: "6 min read"
  },
  {
    title: "The Diaspora Investor's Roadmap (2025 Guide)",
    category: "Diaspora Investment",
    excerpt: "Essential strategies for Cameroonians abroad looking to invest safely in real estate back home. Navigate the challenges and build a profitable portfolio from anywhere in the world.",
    date: "November 20, 2025",
    readTime: "12 min read"
  },
  {
    title: "How to Verify a Property Before Paying Even 1 Franc",
    category: "Property Verification",
    excerpt: "Step-by-step verification process to protect yourself from scams and ensure legitimate property deals. Your complete anti-fraud checklist.",
    date: "November 15, 2025",
    readTime: "10 min read"
  },
  {
    title: "Understanding Land Titles in Cameroon: A Complete Guide",
    category: "Documentation",
    excerpt: "Everything you need to know about land certificates, titles, and the process of securing proper documentation for your property.",
    date: "November 10, 2025",
    readTime: "9 min read"
  },
  {
    title: "Is Real Estate Investment in Cameroon Worth It? 2025 Analysis",
    category: "Market Insights",
    excerpt: "An honest, data-driven analysis of Cameroon's real estate market. Opportunities, risks, and where the smart money is going.",
    date: "November 5, 2025",
    readTime: "15 min read"
  },
  {
    title: "How I Helped a Diaspora Client Avoid a 15M FCFA Scam",
    category: "Case Studies",
    excerpt: "A real case study of how property verification saved a client from a sophisticated fraud scheme. Learn from this close call.",
    date: "October 28, 2025",
    readTime: "7 min read"
  },
  {
    title: "Rental Property Management: What Landlords Should Know",
    category: "Market Insights",
    excerpt: "Best practices for managing rental properties in Yaoundé and Douala. From tenant selection to maintenance and rent collection.",
    date: "October 20, 2025",
    readTime: "11 min read"
  }
];

export function BlogPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">Market Insights & Guidance</h1>
          <p className="text-blue-100 text-xl">
            Expert knowledge to help you make smarter real estate decisions
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full transition-colors ${
                  index === 0
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
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
                      <span>{article.date}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>

                  <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white mb-4">Stay Informed</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Get the latest real estate insights, market analysis, and investment guidance delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
