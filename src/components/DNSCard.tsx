"use client";

import { useEffect, useState } from 'react';
import { checkDNSLeak, DNSInfo } from '@/services/dns';
import styles from './DNSCard.module.css';
import { useTranslation } from '@/i18n/context';
import { Server } from 'lucide-react';
import Skeleton from './Skeleton';

export default function DNSCard() {
    const { t } = useTranslation();
    const [info, setInfo] = useState<DNSInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkDNSLeak().then(data => {
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
                            <Server className={styles.icon} />
                            {t.dns.title}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.grid}>
                            <div className={styles.item} style={{ gridColumn: 'span 2' }}>
                                <span className={styles.label}>{t.dns.servers}</span>
                                <Skeleton width="100%" height="1.2rem" style={{ marginBottom: '0.5rem' }} />
                                <Skeleton width="100%" height="1.2rem" />
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
                        <Server className={styles.icon} />
                        {t.dns.title}
                    </div>
                    {info?.leaking !== undefined && (
                        <span className={styles.statusValue} style={{
                            color: info.leaking ? 'var(--danger)' : 'var(--success)',
                            background: info.leaking ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                            borderColor: info.leaking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            border: '1px solid'
                        }}>
                            {info.leaking ? t.dns.leaking : t.dns.secure}
                        </span>
                    )}
                </div>

                <div className={styles.content}>
                    <div className={styles.grid}>
                        <div className={styles.item} style={{ gridColumn: 'span 2' }}>
                            <span className={styles.label}>{t.dns.provider}</span>
                            <span className={styles.value}>{info?.provider || t.common.unknown}</span>
                        </div>
                        <div className={styles.item} style={{ gridColumn: 'span 2' }}>
                            <span className={styles.label}>{t.dns.servers}</span>
                            <div className={styles.serverContainer}>
                                {info?.servers.map((server, i) => (
                                    <div key={i} className={styles.serverItem}>
                                        <span className={styles.serverIp}>{server}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
