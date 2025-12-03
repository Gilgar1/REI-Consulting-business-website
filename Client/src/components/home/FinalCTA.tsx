import { Calendar, FileText } from "lucide-react";
import { Page } from "../../App";

interface FinalCTAProps {
  setCurrentPage: (page: Page) => void;
}

export function FinalCTA({ setCurrentPage }: FinalCTAProps) {
  return (
    <section className="py-24 bg-royal-blue relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-white mb-6 font-montserrat" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
          Start Your Real Estate Journey with Confidence
        </h2>
        
        <p className="text-gray-300 mb-12 max-w-3xl mx-auto font-inter" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
          Let's help you navigate property financing, land documentation, and investment strategy with clarity and professionalism.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentPage("contact")}
            className="inline-flex items-center justify-center px-8 py-4 bg-gold text-royal-blue rounded-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl font-inter"
            style={{ fontWeight: 600 }}
          >
            <Calendar className="mr-2 w-5 h-5" />
            Book a Free Consultation
          </button>
          <button
            onClick={() => setCurrentPage("loan-assistance")}
            className="inline-flex items-center justify-center px-8 py-4 bg-emerald text-white rounded-lg hover:bg-emerald/90 transition-all shadow-lg font-inter"
            style={{ fontWeight: 600 }}
          >
            <FileText className="mr-2 w-5 h-5" />
            Request Loan Support
          </button>
        </div>
        
        <div className="mt-12 p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-2xl mx-auto">
          <p className="text-gold font-playfair italic" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
            "My mission is to bring integrity, competence, and modern intelligence to the real estate sector. Every client is treated with honesty, clarity, and respect."
          </p>
          <p className="text-white mt-4 font-inter" style={{ fontWeight: 600 }}>
            — Ndah Gilgar M., Founder
          </p>
        </div>
      </div>
    </section>
  );
}
