"use client";

import Link from 'next/link';
import styles from './Header.module.css';
import { useTranslation } from '@/i18n/context';

import Logo from './Logo';

export default function Header() {
    const { t, locale, setLocale } = useTranslation();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div className={styles.logo}>
                        <Logo size={24} />
                        LyraNet
                    </div>
                    <div className={styles.status} style={{ marginLeft: '0' }}>
                        <span className={styles.statusDot}></span>
                        {t.header.systemOnline}
                    </div>
                </div>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>{t.header.dashboard}</Link>
                    <Link href="/about" className={styles.navLink}>{t.header.about}</Link>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'var(--foreground)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                        }}
                    >
                        {locale === 'en' ? '中文' : 'EN'}
                    </button>
                </div>
            </div>
        </header>
    );
}
