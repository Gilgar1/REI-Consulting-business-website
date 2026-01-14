import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary pt-20 pb-10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="REI Consulting" className="h-14 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Transforming real estate in Cameroon with integrity, data-driven insights, and world-class professionalism.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="bg-white/5 p-2 rounded-full hover:bg-accent hover:text-white transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              {['About Us', 'Our Services', 'Property Listings', 'Blog Insights', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to="/" className="hover:text-accent transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Yaoundé, Cameroon</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span>+237 681 478 111</span>
                  <span className="text-slate-500 text-xs">Mon - Fri, 8am - 6pm</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>reiconsultingcm@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">
              Get the latest market insights and legal updates delivered to your inbox.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-accent transition-colors"
              />
              <button className="bg-accent text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} REI Consulting Firm. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-slate-700 hover:text-slate-500">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
}