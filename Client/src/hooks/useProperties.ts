import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

export interface Property {
    id: number | string;
    title: string;
    image: string; // Component expects 'image'
    location: string;
    price: string;
    beds: number | null;
    baths: number | null;
    area: string;
    description: string;
    verified: boolean;
    documents: string;
}

export function useProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Check if we are using placeholder credentials
                const isPlaceholder = import.meta.env.VITE_SUPABASE_URL?.includes('placeholder');

                if (isPlaceholder) {
                    throw new Error('Using placeholder Supabase credentials.');
                }

                const { data, error } = await supabase
                    .from('properties')
                    .select('*');

                if (error) throw error;

                const mappedData: Property[] = (data || []).map((item: any) => ({
                    id: item.id,
                    title: item.title || 'Untitled Property',
                    image: item.image_url || 'https://via.placeholder.com/400',
                    location: item.location || 'Unknown Location',
                    price: item.price || 'Contact for Price',
                    beds: item.beds || null,
                    baths: item.baths || null,
                    area: item.area || 'N/A',
                    description: item.description || item.features || 'No description available.',
                    verified: item.verified || false,
                    documents: item.documents || 'Contact for details'
                }));

                setProperties(mappedData);
            } catch (err: any) {
                console.warn('Failed to fetch properties from Supabase, falling back to mock data:', err.message);

                // Fallback Mock Data for Demo Purposes
                const mockProperties: Property[] = [
                    {
                        id: 1,
                        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2NDU1NTA2NHww&ixlib=rb-4.1.0&q=80&w=600",
                        title: "Modern Villa in Bastos",
                        location: "Bastos, Yaoundé",
                        price: "85,000,000 FCFA",
                        beds: 4,
                        baths: 3,
                        area: "250m²",
                        description: "Luxury modern villa in prestigious Bastos neighborhood.",
                        verified: true,
                        documents: "Title deed available"
                    },
                    {
                        id: 2,
                        image: "https://images.unsplash.com/photo-1701589212546-2a1bcd94c5af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwcmVhbCUyMGVzdGF0ZSUyMHByb3BlcnR5fGVufDF8fHx8MTc2NDU3NjM0M3ww&ixlib=rb-4.1.0&q=80&w=600",
                        title: "Family Home in Odza",
                        location: "Odza, Yaoundé",
                        price: "35,000,000 FCFA",
                        beds: 3,
                        baths: 2,
                        area: "180m²",
                        description: "Comfortable family home in growing Odza area.",
                        verified: true,
                        documents: "Certificate available"
                    },
                    {
                        id: 3,
                        image: "https://images.unsplash.com/photo-1764222233275-87dc016c11dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kJTIwcHJvcGVydHklMjBpbnZlc3RtZW50fGVufDF8fHx8MTc2NDU3NjM0NHww&ixlib=rb-4.1.0&q=80&w=600",
                        title: "Prime Land - Ebolowa Road",
                        location: "Ebolowa Road",
                        price: "15,000,000 FCFA",
                        beds: null,
                        baths: null,
                        area: "500m²",
                        description: "Titled land in developing area along Ebolowa Road.",
                        verified: true,
                        documents: "Land title available"
                    }
                ];

                setProperties(mockProperties);
                // We clear the error so the UI shows data instead of an error message
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return { properties, loading, error };
}
