import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Page } from "../App";
import logo from "figma:asset/0f53ece7be5a1f68c293f979c4d8249e9d2f3025.png";

interface NavigationProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", page: "home" as Page },
    { label: "About", page: "about" as Page },
    { label: "Services", page: "services" as Page },
    { label: "Listings", page: "listings" as Page },
    { label: "Blog", page: "blog" as Page },
    { label: "Contact", page: "contact" as Page },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
        : 'bg-white/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <img 
              src={logo} 
              alt="REI Consulting" 
              className="h-16 md:h-20 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`relative py-2 font-inter transition-all duration-300 ${
                  currentPage === item.page
                    ? "text-royal-blue"
                    : "text-slate hover:text-royal-blue"
                }`}
                style={{ fontWeight: 500, fontSize: '0.95rem' }}
              >
                {item.label}
                {currentPage === item.page && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"></div>
                )}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("contact")}
              className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold/90 text-royal-blue rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 font-inter"
              style={{ fontWeight: 600 }}
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate hover:text-royal-blue transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-left px-4 py-3 rounded-lg transition-all font-inter ${
                    currentPage === item.page
                      ? "text-royal-blue bg-gold/10 border-l-4 border-gold"
                      : "text-slate hover:bg-ivory"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("contact")}
                className="mx-4 mt-2 px-6 py-3 bg-gradient-to-r from-gold to-gold/90 text-royal-blue rounded-full hover:shadow-lg transition-all font-inter"
                style={{ fontWeight: 600 }}
              >
                Book Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}