export const revealClass = "opacity-0 translate-y-8 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[transform,opacity]";
export const revealActiveClass = "opacity-100 translate-y-0";

export const getStaggerDelay = (index: number) => ({
    transitionDelay: `${index * 100}ms`
});

// A hook or helper to observer elements could be useful,
// but for simplicity we will use a simple IntersectionObserver logic in components or a wrapper.
