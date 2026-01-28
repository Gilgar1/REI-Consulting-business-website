import { MapPin, CheckCircle, Bed, Bath, Maximize, FileText, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProperties } from "../hooks/useProperties";

export function PropertyListingsPage() {
  const { properties, loading, error } = useProperties();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">Verified Property Listings</h1>
          <p className="text-blue-100 text-xl">
            Curated, verified properties you can trust
          </p>
        </div>
      </section>

      {/* Notice */}
      <section className="py-8 bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-700">
                <span className="text-blue-600">All properties listed here have been verified</span> by our team.
                We confirm ownership, documentation status, and property details before listing.
                This is not an exhaustive marketplace — we showcase select properties to guide clients and demonstrate our verification standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Locations</option>
              <option>Bastos</option>
              <option>Odza</option>
              <option>Simbock</option>
              <option>Mbankolo</option>
              <option>Nkolbisson</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Types</option>
              <option>Houses</option>
              <option>Land</option>
              <option>Investment Properties</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Price Range</option>
              <option>Under 20M</option>
              <option>20M - 40M</option>
              <option>40M - 60M</option>
              <option>60M+</option>
            </select>
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.verified && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full flex items-center gap-1 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-gray-900 mb-2">{property.title}</h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="text-blue-600 text-xl mb-4">{property.price}</div>

                  {property.beds && (
                    <div className="flex items-center gap-4 mb-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.beds} bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.baths} bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        <span>{property.area}</span>
                      </div>
                    </div>
                  )}

                  {!property.beds && (
                    <div className="flex items-center gap-1 mb-4 text-gray-600 text-sm">
                      <Maximize className="w-4 h-4" />
                      <span>{property.area}</span>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{property.documents}</span>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Request Details
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Verify This Property
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-gray-900 mb-6">Don't See What You're Looking For?</h2>
          <p className="text-gray-600 text-lg mb-8">
            We can help you find the perfect property based on your specific requirements. Let us know what you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Request Property Search
            </button>
            <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
