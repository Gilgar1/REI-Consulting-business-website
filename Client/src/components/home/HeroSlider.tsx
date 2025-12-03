import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Award, Target, TrendingUp, FileCheck, Home } from "lucide-react";
import { Page } from "../../App";
import founderPhoto from "figma:asset/53562da4abfa0bc167e37598fff2c861ff2fe35d.png";
import buildingPhoto from "figma:asset/8bf12cbe120838ab7f3586f269745cde5f2c498b.png";

interface HeroSliderProps {
  setCurrentPage: (page: Page) => void;
}

const slides = [
  {
    image: founderPhoto,
    type: "founder",
    name: "Ndah Gilgar",
    title: "Real Estate Consultant",
    values: [
      { icon: Award, text: "INTEGRITY" },
      { icon: Target, text: "COMPETENCE" },
      { icon: TrendingUp, text: "RESULTS" }
    ],
    cta: "Book Free Consultation",
    ctaSecondary: "Learn More"
  },
  {
    image: buildingPhoto,
    type: "property",
    title: "Modern Real Estate Solutions for Cameroon",
    subtitle: "From loan support to property verification—we simplify your real estate journey with professional guidance",
    cta: "Explore Services",
    ctaSecondary: "View Properties"
  },
  {
    image: "https://images.unsplash.com/photo-1763621550224-6ff277b8c754?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    type: "diaspora",
    title: "Diaspora Investment Strategy",
    subtitle: "Build a profitable property portfolio in Cameroon—safely and intelligently with expert support",
    cta: "Start Investing",
    ctaSecondary: "Contact Us"
  },
  {
    image: "https://images.unsplash.com/photo-1606500307322-61cf2c98aab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    type: "land",
    title: "Land Documentation & Verification",
    subtitle: "Protect your investment with accurate, transparent, and legally compliant land documentation services",
    cta: "Verify Your Land",
    ctaSecondary: "Learn More"
  },
  {
    image: "https://images.unsplash.com/photo-1585011191285-8b443579631c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    type: "residential",
    title: "Premium Residential Properties",
    subtitle: "Curated selection of verified modern homes and investment opportunities across Cameroon",
    cta: "View Listings",
    ctaSecondary: "Book Tour"
  }
];

export function HeroSlider({ setCurrentPage }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden pt-0">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.type === "founder" ? slide.name : slide.title}
              className="w-full h-full object-cover"
            />
            {/* Dynamic Gradient Overlay based on slide type */}
            {slide.type === "founder" ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/90 via-royal-blue/75 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/80 via-transparent to-transparent"></div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/95 via-royal-blue/80 to-royal-blue/60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/60 via-transparent to-transparent"></div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-4xl">
                {/* Animated Content */}
                <div
                  className={`transition-all duration-1000 delay-300 ${
                    index === currentSlide
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-10 opacity-0'
                  }`}
                >
                  {slide.type === "founder" ? (
                    // Founder Slide
                    <>
                      <div className="inline-block mb-8">
                        <div className="px-5 py-2.5 bg-gold/20 backdrop-blur-sm border border-gold/40 rounded-full">
                          <span className="text-gold font-inter" style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.1em' }}>
                            YOUR TRUSTED REAL ESTATE PARTNER
                          </span>
                        </div>
                      </div>

                      <div className="max-w-xl">
                        <h1 
                          className="text-white mb-3 font-montserrat"
                          style={{ 
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
                            fontWeight: 800, 
                            letterSpacing: '-0.02em', 
                            lineHeight: '1.1',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          {slide.name}
                        </h1>

                        <p 
                          className="text-gold mb-12 font-inter"
                          style={{ 
                            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                            fontWeight: 600, 
                            letterSpacing: '0.02em',
                            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                          }}
                        >
                          {slide.title}
                        </p>

                        {/* Core Values - 2 on top, 1 below */}
                        <div className="mb-12 max-w-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            {slide.values?.slice(0, 2).map((value, idx) => {
                              const Icon = value.icon;
                              return (
                                <div 
                                  key={idx} 
                                  className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl hover:bg-white/15 transition-all duration-300 hover:border-gold shadow-lg hover:scale-105"
                                >
                                  <div className="w-11 h-11 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Icon className="w-5 h-5 text-royal-blue" />
                                  </div>
                                  <span 
                                    className="text-white font-montserrat" 
                                    style={{ 
                                      fontSize: '1rem', 
                                      fontWeight: 700, 
                                      letterSpacing: '0.05em',
                                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(0, 0, 0, 0.6)'
                                    }}
                                  >
                                    {value.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          {slide.values?.[2] && (
                            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-xl hover:bg-white/15 transition-all duration-300 hover:border-gold shadow-lg hover:scale-105 max-w-xs">
                              <div className="w-11 h-11 bg-gold rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                                <TrendingUp className="w-5 h-5 text-royal-blue" />
                              </div>
                              <span 
                                className="text-white font-montserrat" 
                                style={{ 
                                  fontSize: '1rem', 
                                  fontWeight: 700, 
                                  letterSpacing: '0.05em',
                                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(0, 0, 0, 0.6)'
                                }}
                              >
                                {slide.values[2].text}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => setCurrentPage("contact")}
                            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold via-gold to-gold/90 text-royal-blue rounded-full hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 font-inter transform hover:scale-110 hover:-translate-y-1"
                            style={{ fontWeight: 600, fontSize: '1.05rem' }}
                          >
                            {slide.cta}
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </button>
                          <button 
                            onClick={() => setCurrentPage("about")}
                            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full hover:bg-white/20 hover:border-gold backdrop-blur-md transition-all duration-300 font-inter hover:scale-105"
                            style={{ fontWeight: 600, fontSize: '1.05rem' }}
                          >
                            {slide.ctaSecondary}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Other Slides
                    <>
                      <div className="inline-block mb-6">
                        <div className="px-4 py-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full">
                          <span className="text-gold font-inter" style={{ fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                            PROFESSIONAL REAL ESTATE CONSULTING
                          </span>
                        </div>
                      </div>

                      <h1 
                        className="text-white mb-6 font-montserrat leading-tight"
                        style={{ 
                          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
                          fontWeight: 800, 
                          letterSpacing: '-0.02em',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.5)'
                        }}
                      >
                        {slide.title}
                      </h1>
                      
                      <p 
                        className="text-gray-200 mb-10 max-w-2xl font-inter leading-relaxed"
                        style={{ 
                          fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                        }}
                      >
                        {slide.subtitle}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => {
                            if (slide.type === "property") setCurrentPage("services");
                            else if (slide.type === "diaspora") setCurrentPage("diaspora-strategy");
                            else if (slide.type === "land") setCurrentPage("documentation");
                            else if (slide.type === "residential") setCurrentPage("listings");
                          }}
                          className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold via-gold to-gold/90 text-royal-blue rounded-full hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 font-inter transform hover:scale-105"
                          style={{ fontWeight: 600 }}
                        >
                          {slide.cta}
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => {
                            if (slide.type === "property") setCurrentPage("listings");
                            else if (slide.type === "residential") setCurrentPage("contact");
                            else setCurrentPage("contact");
                          }}
                          className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full hover:bg-white/20 backdrop-blur-md transition-all duration-300 font-inter"
                          style={{ fontWeight: 600 }}
                        >
                          {slide.ctaSecondary}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-gold/90 backdrop-blur-md border border-white/30 hover:border-gold rounded-full transition-all duration-300 hover:scale-110 z-20 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-7 h-7 text-white group-hover:text-royal-blue" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white/10 hover:bg-gold/90 backdrop-blur-md border border-white/30 hover:border-gold rounded-full transition-all duration-300 hover:scale-110 z-20 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-7 h-7 text-white group-hover:text-royal-blue" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-2.5 bg-gold shadow-lg shadow-gold/50'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/60 text-xs font-inter uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}