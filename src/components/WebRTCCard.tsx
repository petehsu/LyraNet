"use client";

import { useEffect, useState } from 'react';
import { checkWebRTCLeak, WebRTCInfo } from '@/services/webrtc';
import styles from './WebRTCCard.module.css';
import { useTranslation } from '@/i18n/context';
import { Share2 } from 'lucide-react';
import Skeleton from './Skeleton';

export default function WebRTCCard() {
    const { t } = useTranslation();
    const [info, setInfo] = useState<WebRTCInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkWebRTCLeak().then(data => {
            setInfo(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="glass-card">
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <Share2 className={styles.icon} />
                            {t.webrtc.title}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.grid}>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.webrtc.localIP}</span>
                                <Skeleton width="80%" height="1.2rem" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!info) return null;

    return (
        <div className="glass-card">
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Share2 className={styles.icon} />
                        {t.webrtc.title}
                    </div>
                    <span className={styles.statusValue} style={{
                        color: info.leaking ? 'var(--danger)' : 'var(--success)',
                        background: info.leaking ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        borderColor: info.leaking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        border: '1px solid'
                    }}>
                        {info.leaking ? t.webrtc.leaking : t.webrtc.secure}
                    </span>
                </div>

                <div className={styles.content}>
                    <div className={styles.grid}>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.webrtc.localIP}</span>
                            <span className={styles.value}>{info.ip || t.common.unknown}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
