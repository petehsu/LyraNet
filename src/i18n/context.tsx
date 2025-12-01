"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Translations, Locale } from './types';
import { en } from './locales/en';
import { zh } from './locales/zh';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('zh'); // Default to Chinese as requested by user context implies Chinese user

    useEffect(() => {
        // Optional: Detect browser language
        const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
        // Only set if not already set by user (could persist in localStorage)
        // For now, let's just default to 'zh' or browser preference on first load
        // But since we want to force 'zh' initially based on user interaction language, we can stick to 'zh' default
    }, []);

    const t = locale === 'zh' ? zh : en;

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within an I18nProvider');
    }
    return context;
}
