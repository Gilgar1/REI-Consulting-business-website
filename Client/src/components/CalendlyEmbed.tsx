import { useEffect, useState } from 'react';
import { Loader2, Calendar, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface CalendlyEmbedProps {
  url?: string;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
}

export function CalendlyEmbed({
  url = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/reiconsultingcm/consultation',
  className = '',
  prefill,
}: CalendlyEmbedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Construct prefilled parameters if provided
    let finalUrl = url;
    if (prefill) {
      const params = new URLSearchParams();
      if (prefill.name) params.set('name', prefill.name);
      if (prefill.email) params.set('email', prefill.email);
      if (params.toString()) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.toString();
      }
    }

    const scriptSrc = 'https://assets.calendly.com/assets/external/widget.js';
    let script = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null;

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    if (!script) {
      script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.onload = () => {
        setLoading(false);
      };
      script.onerror = () => {
        setError(true);
        setLoading(false);
      };
      document.body.appendChild(script);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [url, prefill]);

  return (
    <div className={`relative min-h-[680px] w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
          <Loader2 className="w-10 h-10 animate-spin text-accent mb-3" />
          <p className="text-sm font-medium text-slate-600">Loading consultation schedule...</p>
        </div>
      )}

      {error ? (
        <div className="p-8 text-center max-w-md mx-auto my-16 space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-accent rounded-full flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-primary">Schedule via Calendly</h3>
          <p className="text-sm text-slate-600">
            If the embedded scheduler is blocked by your browser extensions, you can open our calendar directly in a new tab:
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-white">
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <span>Open Calendly Direct</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      ) : (
        <div
          className="calendly-inline-widget w-full"
          data-url={url}
          style={{ minWidth: '320px', height: '700px' }}
        />
      )}
    </div>
  );
}
