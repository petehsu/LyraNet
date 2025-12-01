"use client";

import { useEffect, useState } from 'react';
import { getFingerprint, FingerprintInfo } from '@/services/fingerprint';
import styles from './FingerprintCard.module.css';
import { useTranslation } from '@/i18n/context';
import { Fingerprint } from 'lucide-react';
import Skeleton from './Skeleton';
import { UAParser } from 'ua-parser-js';

export default function FingerprintCard() {
    const { t } = useTranslation();
    const [info, setInfo] = useState<FingerprintInfo | null>(null);
    const [uaResult, setUaResult] = useState<UAParser.IResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFingerprint().then(data => {
            setInfo(data);
            const parser = new UAParser(data.userAgent);
            setUaResult(parser.getResult());
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="glass-card">
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <Fingerprint className={styles.icon} />
                            {t.fingerprint.title}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.grid}>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.fingerprint.userAgent}</span>
                                <Skeleton width="100%" height="3rem" />
                            </div>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.fingerprint.language}</span>
                                <Skeleton width="40%" height="1.2rem" />
                            </div>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.fingerprint.resolution}</span>
                                <Skeleton width="40%" height="1.2rem" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card">
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Fingerprint className={styles.icon} />
                        {t.fingerprint.title}
                    </div>
                    <span className={styles.hash}>{info?.canvasHash.slice(0, 8)}...</span>
                </div>

                <div className={styles.content}>
                    <div className={styles.grid}>
                        <div className={styles.item}>
                            <span className={styles.label}>Browser</span>
                            <span className={styles.value}>
                                {uaResult?.browser.name} {uaResult?.browser.version}
                            </span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>OS</span>
                            <span className={styles.value}>
                                {uaResult?.os.name} {uaResult?.os.version}
                            </span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.fingerprint.language}</span>
                            <span className={styles.value}>{info?.language}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.fingerprint.resolution}</span>
                            <span className={styles.value}>{info?.screenResolution}</span>
                        </div>
                        <div className={styles.item} style={{ gridColumn: 'span 2' }}>
                            <span className={styles.label}>User Agent</span>
                            <div className={styles.userAgentBox} style={{ fontSize: '0.7rem', padding: '0.5rem' }}>
                                {info?.userAgent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
