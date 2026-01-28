import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from '../utils/analytics';

export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        logPageView();
    }, [location]);
};
