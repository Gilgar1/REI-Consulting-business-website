import { MapPin, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Page } from "../../App";
import { useEffect, useState } from "react";
import api from "../../api";

interface FeaturedPropertiesProps {
  setCurrentPage: (page: Page) => void;
}

export function FeaturedProperties({ setCurrentPage }: FeaturedPropertiesProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    api.get('/api/properties/').then((data) => {
      if (!mounted) return;
      setProperties(data || []);
    }).catch((err) => {
      console.error('Failed to load properties', err);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-royal-blue mb-4 font-montserrat" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Verified Property Listings
          </h2>
          <p className="text-slate font-inter" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
            Curated, trusted properties for credibility and client guidance
          </p>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading && <div className="col-span-full text-center">Loading...</div>}
            {!loading && properties.length === 0 && <div className="col-span-full text-center">No listings available</div>}
            {properties.map((property: any) => (
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gold hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={property.image_url}
                    alt={property.location}
                    className="w-full h-full object-cover"
                  />
                  {property.verified && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-emerald text-white rounded-full flex items-center gap-1 text-sm font-inter" style={{ fontWeight: 600 }}>
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-slate flex-shrink-0 mt-0.5" />
                    <span className="text-slate font-inter">{property.location}</span>
                  </div>
                  
                  <div className="text-gold mb-3 font-montserrat" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {property.price}
                  </div>
                  
                  <p className="text-slate font-inter text-sm mb-4">{property.features}</p>
                  
                  <button className="w-full px-4 py-2 bg-royal-blue text-white rounded-lg hover:bg-gold hover:text-royal-blue transition-all font-inter" style={{ fontWeight: 600 }}>
                    Request Details
                  </button>
                </div>
              </div>
            ))}
          </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentPage("listings")}
            className="inline-flex items-center px-8 py-3 bg-gold text-royal-blue rounded-lg hover:bg-gold-dark transition-all shadow-lg font-inter"
            style={{ fontWeight: 600 }}
          >
            View All Listings →
          </button>
        </div>
      </div>
    </section>
  );
}