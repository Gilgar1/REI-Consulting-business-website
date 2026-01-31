import { useState } from 'react';
import { Menu, X, Phone, User, LogOut, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../i18n/LanguageContext'; // Custom hook
import logo from '../assets/logo.png';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.listings, path: '/listings' },
    { name: t.nav.blog, path: '/blog' },
    { name: t.nav.contact, path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && currentPath !== '/') return false;
    return currentPath.startsWith(path);
  };

  const handleLangChange = (lang: 'en' | 'fr') => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-primary md:bg-white/95 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsOpen(false)}
          >
            <img src={logo} alt="REI Consulting" className="h-12 md:h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300
                  ${isActive(link.path) ? 'text-accent' : 'text-slate-600 hover:text-primary'}
                `}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0'}`}></span>
              </Link>
            ))}

            {/* Language Switcher (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-slate-600 hover:text-primary font-medium text-sm focus:outline-none"
              >
                {language === 'en' ? 'EN' : 'FR'}
                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-20 bg-white rounded-lg shadow-xl border border-slate-100 py-1 overflow-hidden animate-fade-in-up">
                  <button
                    onClick={() => handleLangChange('en')}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-primary/5 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLangChange('fr')}
                    className={`block w-full text-left px-4 py-2 text-sm ${language === 'fr' ? 'bg-primary/5 text-accent' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    FR
                  </button>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-slate-600 hover:text-primary text-sm font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t.nav.logout}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-primary text-sm font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t.nav.login}
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 border border-primary/20 text-primary text-sm font-semibold rounded-full hover:bg-primary/5 transition-all duration-300"
                >
                  {t.nav.signup}
                </Link>
              </div>
            )}

            <Link
              to="/contact"
              className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              {t.nav.book}
            </Link>
          </div>

          {/* Mobile Menu Button + Lang Toggle (Mobile) */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Simple Lang Toggle for Mobile Header */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="text-white/80 font-bold text-sm tracking-wide border border-white/20 px-2 py-1 rounded"
            >
              {language === 'en' ? 'FR' : 'EN'}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white md:text-slate-600 hover:text-white md:hover:text-primary p-2 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-[9999] w-full h-screen bg-[#05162b] shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="font-heading font-bold text-lg text-white">Menu</span>
            <div className="flex items-center gap-4">
              {/* Language Switcher inside Menu too */}
              <div className="flex bg-white/10 rounded p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${language === 'en' ? 'bg-accent text-white' : 'text-slate-300'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${language === 'fr' ? 'bg-accent text-white' : 'text-slate-300'}`}
                >
                  FR
                </button>
              </div>

              <button onClick={() => setIsOpen(false)} className="p-2 text-white/70 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors ${isActive(link.path) ? 'text-accent' : 'text-slate-300 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-lg font-medium text-slate-300 hover:text-white text-left flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {t.nav.logout}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
              >
                <User className="w-5 h-5" />
                {t.nav.login}
              </Link>
            )}

          </div>

          <div className="mt-auto">
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full justify-center flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              {t.nav.book}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}