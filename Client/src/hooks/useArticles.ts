import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image: string;
    publishedAt: string;
    readTime: string;
}

function estimateReadTime(content: string): string {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200)); // ~200 wpm average
    return `${minutes} min read`;
}

function mapArticle(item: any): Article {
    return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || '',
        content: item.content || '',
        category: item.category || 'General',
        image: item.image_url || '',
        publishedAt: item.published_at,
        readTime: estimateReadTime(item.content || item.excerpt || ''),
    };
}

export function useArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('published', true)
                .order('published_at', { ascending: false });

            if (error) {
                console.error('Supabase articles fetch failed:', error.message);
                setError(error.message);
                setArticles([]);
                setLoading(false);
                return;
            }

            setArticles((data || []).map(mapArticle));
            setLoading(false);
        };

        fetchArticles();
    }, []);

    return { articles, loading, error };
}

export function useArticle(slug: string) {
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOne = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            if (error) {
                setError(error.message);
                setArticle(null);
                setLoading(false);
                return;
            }

            setArticle(mapArticle(data));
            setLoading(false);
        };

        if (slug) fetchOne();
    }, [slug]);

    return { article, loading, error };
}
