import { Building2, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Page } from "../App";

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

export function Footer({ setCurrentPage }: FooterProps) {
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-royal-blue text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-gold" />
              <span className="text-white font-montserrat" style={{ fontSize: '1.25rem', fontWeight: 700 }}>REI CONSULTING FIRM</span>
            </div>
            <p className="text-gray-300 mb-4 font-inter leading-relaxed">
              Real Estate Intelligence for Modern Africa
            </p>
            <p className="text-gray-400 mb-6 font-inter text-sm leading-relaxed">
              Trusted guidance for property financing, land documentation, and investment strategy—built on integrity, competence, and data-driven insight.
            </p>
            <div className="text-gray-400 text-sm font-inter">
              Founded by Ndah Gilgar M<br />
              Software Engineer & Real Estate Consultant
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4 font-montserrat" style={{ fontSize: '1.125rem', fontWeight: 600 }}>Quick Links</h3>
            <ul className="space-y-3 font-inter">
              <li>
                <button onClick={() => handleNavClick("about")} className="hover:text-gold transition-colors">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("services")} className="hover:text-gold transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("loan-assistance")} className="hover:text-gold transition-colors">
                  Loan Support
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("listings")} className="hover:text-gold transition-colors">
                  Property Listings
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("blog")} className="hover:text-gold transition-colors">
                  Insights & Blog
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("contact")} className="hover:text-gold transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4 font-montserrat" style={{ fontSize: '1.125rem', fontWeight: 600 }}>Contact</h3>
            <ul className="space-y-3 font-inter text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+237 681 478 111</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <a href="https://wa.me/237681478111" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>reiconsultingcm@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>Yaoundé, Cameroon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-gray-400 text-sm font-inter">
          <p>&copy; 2025 REI Consulting Firm. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}