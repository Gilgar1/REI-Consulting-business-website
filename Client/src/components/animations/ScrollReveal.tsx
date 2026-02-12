
import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    staggerIndex?: number;
    threshold?: number;
}

export function ScrollReveal({ children, className = "", staggerIndex = 0, threshold = 0.1 }: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    // Base utilities for premium feel
    const baseTransition = "transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[transform,opacity]";
    const hiddenState = "opacity-0 translate-y-8";
    const visibleState = "opacity-100 translate-y-0";

    // Dynamic delay
    const delayStyle = { transitionDelay: `${staggerIndex * 150}ms` };

    return (
        <div
            ref={ref}
            className={`${baseTransition} ${isVisible ? visibleState : hiddenState} ${className}`}
            style={delayStyle}
        >
            {children}
        </div>
    );
}
