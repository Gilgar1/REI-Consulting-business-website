import { useState, useEffect } from 'react';
import api from '../api';

export interface Property {
    id: number;
    title: string;
    image_url: string;
    location: string;
    price: string;
    features: string;
    verified: boolean;
    created_at: string;
}

export function useProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await api.get('/api/properties/');
                const data = Array.isArray(response.data) ? response.data : response.data.results || [];
                setProperties(data);
            } catch (err) {
                console.error('Failed to fetch properties:', err);
                setError('Failed to load properties.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return { properties, loading, error };
}
