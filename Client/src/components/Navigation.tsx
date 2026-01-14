import { useState } from 'react';
import { Menu, X, Phone, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Listings', path: '/listings' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && currentPath !== '/') return false;
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/95 border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsOpen(false)}
          >
            <img src={logo} alt="REI Consulting" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-slate-600 hover:text-primary text-sm font-medium flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-primary text-sm font-medium flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 border border-primary/20 text-primary text-sm font-semibold rounded-full hover:bg-primary/5 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              to="/contact"
              className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-accent hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary p-2 transition-colors"
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
        className={`fixed top-0 right-0 z-50 w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="font-heading font-bold text-lg text-primary">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col space-y-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors ${isActive(link.path) ? 'text-accent' : 'text-slate-600'
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
                className="text-lg font-medium text-slate-600 text-left flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-600 flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Login
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
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}