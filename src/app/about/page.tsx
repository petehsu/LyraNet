"use client";

import styles from './page.module.css';
import { useTranslation } from '@/i18n/context';
import { Github, Shield, Zap, Globe, Heart } from 'lucide-react';

import Logo from '@/components/Logo';

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className="glass-card">
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <Logo size={64} />
                            <h1 className={styles.title}>{t.about.title}</h1>
                        </div>
                        <p className={styles.subtitle}>
                            {t.about.subtitle}
                        </p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <Shield className={styles.icon} />
                            <h3>{t.about.security.title}</h3>
                            <p>{t.about.security.desc}</p>
                        </div>
                        <div className={styles.card}>
                            <Zap className={styles.icon} />
                            <h3>{t.about.performance.title}</h3>
                            <p>{t.about.performance.desc}</p>
                        </div>
                        <div className={styles.card}>
                            <Globe className={styles.icon} />
                            <h3>{t.about.insight.title}</h3>
                            <p>{t.about.insight.desc}</p>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <p className={styles.version}>Version 1.0.0</p>
                        <div className={styles.links}>
                            <a
                                href="https://github.com/petehsu/LyraNet"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.githubLink}
                            >
                                <Github size={20} />
                                {t.about.viewOnGithub}
                            </a>
                        </div>
                        <p className={styles.credit}>
                            Made with <Heart size={14} style={{ display: 'inline', color: 'var(--danger)' }} /> by Pete Hsu
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
