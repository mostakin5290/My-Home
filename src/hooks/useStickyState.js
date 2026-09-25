import React, { useState, useEffect } from 'react';

export const useStickyState = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
        try {
            const stickyValue = localStorage.getItem(`pro_dash_v3_${key}`);
            if (stickyValue !== null && stickyValue !== 'undefined') {
                return JSON.parse(stickyValue);
            }
        } catch (e) {
            console.warn(`Error reading sticky state for key "${key}":`, e);
        }
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    });

    useEffect(() => {
        try {
            if (value !== undefined) {
                localStorage.setItem(`pro_dash_v3_${key}`, JSON.stringify(value));
            }
        } catch (e) {
            console.warn(`Error saving sticky state for key "${key}":`, e);
        }
    }, [key, value]);

    return [value, setValue];
};

export default useStickyState;
