import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import logo from '../assets/logo.png';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();

  const navLinks = [
    { label: t.nav.about, path: '/about' },
    { label: t.nav.services, path: '/services' },
    { label: t.nav.listings, path: '/listings' },
    { label: t.nav.simulator, path: '/simulator' },
    { label: t.nav.eligibility, path: '/eligibility' },
    { label: t.nav.blog, path: '/blog' },
    { label: t.nav.book, path: '/book' },
  ];

  return (
    <footer className="bg-primary pt-12 md:pt-20 pb-10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="REI Consulting" className="h-14 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t.footer.tagline}
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
            <h4 className="font-heading font-bold text-white mb-6">{t.footer.quick_links}</h4>
            <ul className="space-y-3 text-sm">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-accent transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-white mb-6">{t.footer.contact_us}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>{language === 'fr' ? 'Yaoundé, Cameroun' : 'Yaoundé, Cameroon'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span>+237 681 478 111</span>
                  <span className="text-slate-500 text-xs">
                    {language === 'fr' ? 'Lun - Ven, 8h - 18h' : 'Mon - Fri, 8am - 6pm'}
                  </span>
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
            <h4 className="font-heading font-bold text-white mb-6">
              {language === 'fr' ? 'Bulletin d\'information' : 'Newsletter'}
            </h4>
            <p className="text-sm text-slate-400 mb-4">
              {language === 'fr'
                ? 'Recevez les dernières analyses de marché et veilles juridiques directement par email.'
                : 'Get the latest market insights and legal updates delivered to your inbox.'}
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={language === 'fr' ? 'Votre adresse email' : 'Email Address'}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="bg-accent text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                {language === 'fr' ? "S'abonner" : 'Subscribe'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} REI Consulting Firm. {t.footer.rights}</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white transition-colors">{language === 'fr' ? 'Confidentialité' : 'Privacy Policy'}</Link>
            <Link to="#" className="hover:text-white transition-colors">{language === 'fr' ? 'Conditions Générales' : 'Terms of Service'}</Link>
            <Link to="#" className="hover:text-white transition-colors">{language === 'fr' ? 'Cookies' : 'Cookie Policy'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}