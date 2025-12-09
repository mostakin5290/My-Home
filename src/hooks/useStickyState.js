import { useState, useEffect } from 'react';

export const useStickyState = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
        const stickyValue = localStorage.getItem(`pro_dash_v3_${key}`);
        return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(`pro_dash_v3_${key}`, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};
