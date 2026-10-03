import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface Property {
    id: number | string;
    title: string;
    image: string;
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
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase properties fetch failed:', error.message);
                setError(error.message);
                setProperties([]);
                setLoading(false);
                return;
            }

            const mappedData: Property[] = (data || []).map((item: any) => ({
                id: item.id,
                title: item.title || 'Untitled Property',
                image: item.image_url || 'https://via.placeholder.com/400',
                location: item.location || 'Unknown Location',
                price: item.price || 'Contact for Price',
                beds: item.beds ?? null,
                baths: item.baths ?? null,
                area: item.area || 'N/A',
                description: item.description || item.features || 'No description available.',
                verified: item.verified || false,
                documents: item.documents || 'Contact for details'
            }));

            setProperties(mappedData);
            setLoading(false);
        };

        fetchProperties();
    }, []);

    return { properties, loading, error };
}
