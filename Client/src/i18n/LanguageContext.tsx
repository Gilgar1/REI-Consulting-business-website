
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from './en';
import { fr } from './fr';

// Define the shape of the dictionary based on the English file
type Translations = typeof en;

type Language = 'en' | 'fr';

interface LanguageContextType {
    language: Language;
    t: Translations;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Initialize from localStorage or default to 'en'
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('app_language');
        return (saved === 'fr' || saved === 'en') ? saved : 'en';
    });

    const [t, setT] = useState<Translations>(language === 'fr' ? fr : en);

    // Update translations and localStorage when language changes
    useEffect(() => {
        localStorage.setItem('app_language', language);
        setT(language === 'fr' ? fr : en);

        // Update HTML lang attribute for SEO
        document.documentElement.lang = language;
        document.documentElement.dir = 'ltr'; // Assuming both are LTR, can support RTL if needed
    }, [language]);

    const toggleLanguage = () => {
        setLanguageState(prev => prev === 'en' ? 'fr' : 'en');
    };

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
