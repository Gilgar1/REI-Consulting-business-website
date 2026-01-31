import { MapPin, CheckCircle, FileText } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Property } from "../hooks/useProperties";

interface PropertyCardProps {
    property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
    // Parse features if string, or handle potential missing fields from backend vs mock
    // Backend has 'features' as CharField. Frontend mock had beds/baths.
    // We might not have beds/baths from backend yet given the model I saw earlier (title, image_url, location, price, features, verified).
    // So I will attempt to parse 'features' or just show description if features is the description.

    return (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow shadow-sm flex flex-col h-full">
            <div className="relative h-64">
                <ImageWithFallback
                    src={property.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                {property.verified && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full flex items-center gap-1 text-sm shadow-md">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-heading font-bold text-primary mb-2 line-clamp-1">{property.title}</h3>

                <div className="flex items-center gap-2 text-slate-600 mb-4">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{property.location}</span>
                </div>

                <div className="text-accent font-bold text-2xl mb-4">{property.price}</div>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {property.features || "No description available."}
                </p>

                <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500 text-xs font-medium">Verified Title Deed</span>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold">
                            Request Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
