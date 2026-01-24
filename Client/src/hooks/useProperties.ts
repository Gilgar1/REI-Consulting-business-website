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
                const { data, error } = await supabase
                    .from('properties')
                    .select('*');

                if (error) throw error;

                // Map Supabase data to frontend expected shape
                // Defaulting missing fields since schema might be simple
                const mappedData: Property[] = (data || []).map((item: any) => ({
                    id: item.id,
                    title: item.title || 'Untitled Property',
                    image: item.image_url || 'https://via.placeholder.com/400',
                    location: item.location || 'Unknown Location',
                    price: item.price || 'Contact for Price',
                    beds: item.beds || null, // Assuming column added or null
                    baths: item.baths || null,
                    area: item.area || 'N/A',
                    description: item.description || item.features || 'No description available.',
                    verified: item.verified || false,
                    documents: item.documents || 'Contact for details'
                }));

                setProperties(mappedData);
            } catch (err: any) {
                console.error('Failed to fetch properties:', err);
                setError(err.message || 'Failed to load properties.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return { properties, loading, error };
}
