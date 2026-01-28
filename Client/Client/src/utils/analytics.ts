import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        console.log('Google Analytics Initialized');
    } else {
        console.warn('Google Analytics Measurement ID is missing. Analytics will not work.');
    }
};

export const logPageView = () => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }
};

export const logEvent = (category: string, action: string, label?: string) => {
    if (GA_MEASUREMENT_ID) {
        ReactGA.event({
            category: category,
            action: action,
            label: label,
        });
    }
};
