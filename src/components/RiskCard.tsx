"use client";

import { useEffect, useState } from 'react';
import { calculateRisk, RiskInfo } from '@/services/risk';
import { getIPInfo } from '@/services/ip';
import { checkDNSLeak } from '@/services/dns';
import { checkWebRTCLeak } from '@/services/webrtc';
import { getFingerprint } from '@/services/fingerprint';
import { getGPSPosition, calculateDistance } from '@/services/gps';
import styles from './RiskCard.module.css';
import { useTranslation } from '@/i18n/context';
import { ShieldAlert } from 'lucide-react';
import Skeleton from './Skeleton';

interface RiskCardProps {
    onScan?: () => void;
}

export default function RiskCard({ onScan }: RiskCardProps) {
    const { t } = useTranslation();
    const [info, setInfo] = useState<RiskInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function analyze() {
            setLoading(true);
            try {
                const [ip, dns, webrtc, fp, gps] = await Promise.all([
                    getIPInfo(),
                    checkDNSLeak(),
                    checkWebRTCLeak(),
                    getFingerprint(),
                    getGPSPosition(),
                ]);

                let gpsDistance: number | null = null;
                if (gps.latitude && gps.longitude && ip.latitude && ip.longitude) {
                    gpsDistance = calculateDistance(gps.latitude, gps.longitude, ip.latitude, ip.longitude);
                }

                const riskInfo = calculateRisk(
                    ip.proxy,
                    dns.leaking,
                    webrtc.leaking,
                    fp.isConsistent,
                    gpsDistance,
                    ip.type
                );

                setInfo(riskInfo);
            } catch (error) {
                console.error("Error analyzing risk:", error);
            } finally {
                setLoading(false);
            }
        }

        analyze();
    }, []); // We might want to re-trigger this if a prop changes, but for now the parent controls the key

    if (loading) {
        return (
            <div className="glass-card">
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            <ShieldAlert className={styles.icon} />
                            {t.risk.title}
                        </h2>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.scoreContainer}>
                            <div className={styles.ring}>
                                <Skeleton width="100%" height="100%" borderRadius="50%" />
                            </div>
                        </div>
                        <div className={styles.factors}>
                            <Skeleton width="100%" height="1.5rem" style={{ marginBottom: '0.5rem' }} />
                            <Skeleton width="100%" height="1.5rem" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!info) return null;

    const getColor = (score: number) => {
        if (score > 80) return 'var(--danger)'; // Critical
        if (score > 50) return 'var(--warning)'; // High
        if (score > 20) return '#facc15'; // Medium
        return 'var(--success)'; // Low
    };

    const color = getColor(info.score);

    return (
        <div className="glass-card">
            <div className={styles.card}>
                <div className={styles.glow} style={{ background: `radial-gradient(circle at 50% 0%, ${color}20, transparent 70%)` }} />
                <div className={styles.header}>
                    <div className={styles.title}>
                        <ShieldAlert className={styles.icon} style={{ color }} />
                        {t.risk.title}
                    </div>
                    <span className={styles.badge} style={{
                        color: color,
                        background: `${color}10`,
                        borderColor: `${color}20`
                    }}>
                        {t.risk.levels[info.level.toLowerCase() as keyof typeof t.risk.levels]}
                    </span>
                </div>

                <div className={styles.content}>
                    <div
                        className={styles.scoreCircle}
                        style={{ borderTopColor: color, borderRightColor: color, cursor: 'pointer' }}
                        onClick={onScan}
                        title={t.common.reScan}
                    >
                        <div className={styles.scoreValue} style={{ color: color }}>{info.score}</div>
                    </div>

                    <div className={styles.factors}>
                        <h3 className={styles.factorsTitle}>{t.risk.factors}</h3>
                        {info.factors.length === 0 ? (
                            <div className={styles.noFactors}>
                                {t.risk.noFactors}
                            </div>
                        ) : (
                            <ul className={styles.factorList}>
                                {info.factors.map((factor, i) => (
                                    <li key={i} className={styles.factorItem}>
                                        <span className={styles.factorDot} style={{ background: color }} />
                                        {t.risk.factorMap[factor] || factor}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
