"use client";

import { useEffect, useState } from 'react';
import { getIPInfo, IPInfo } from '@/services/ip';
import styles from './IPCard.module.css';
import { useTranslation } from '@/i18n/context';
import { Globe } from 'lucide-react';
import Skeleton from './Skeleton';

export default function IPCard() {
    const { t } = useTranslation();
    const [info, setInfo] = useState<IPInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getIPInfo().then(data => {
            setInfo(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="glass-card">
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.ipDisplay}>
                            <div className={styles.ipLabel}>{t.ip.ip}</div>
                            <Skeleton width="200px" height="2.5rem" style={{ margin: '0.5rem auto' }} />
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.grid}>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.ip.location}</span>
                                <Skeleton width="80%" height="1.2rem" />
                            </div>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.ip.isp}</span>
                                <Skeleton width="80%" height="1.2rem" />
                            </div>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.ip.asn}</span>
                                <Skeleton width="60%" height="1.2rem" />
                            </div>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.ip.timezone}</span>
                                <Skeleton width="60%" height="1.2rem" />
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
                        <Globe className={styles.icon} />
                        {t.ip.title}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.ipDisplay}>
                        <div className={styles.ipValue}>{info.ip}</div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.ip.location}</span>
                            <span className={styles.value} title={`${info.city}, ${info.country}`}>
                                {info.city}, {info.country}
                            </span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.ip.isp}</span>
                            <span className={styles.value} title={info.isp}>
                                {info.isp}
                            </span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>ASN</span>
                            <span className={styles.value}>{info.asn}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.ip.timezone}</span>
                            <span className={styles.value}>{info.timezone}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.ip.type}</span>
                            <span className={styles.value} style={{
                                color: info.type === 'residential' ? 'var(--success)' : 'var(--warning)'
                            }}>
                                {t.ip.types[info.type] || info.type}
                            </span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>{t.ip.proxy}</span>
                            <span className={styles.value} style={{
                                color: info.proxy ? 'var(--danger)' : 'var(--success)'
                            }}>
                                <div className={styles.proxyStatus}>
                                    <span className={styles.proxyDot} style={{
                                        boxShadow: `0 0 8px ${info.proxy ? 'var(--danger)' : 'var(--success)'}`
                                    }} />
                                    {info.proxy ? t.ip.status.proxy : t.ip.status.clean}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
