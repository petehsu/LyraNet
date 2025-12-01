"use client";

import { useEffect, useState } from 'react';
import { getIPInfo } from '@/services/ip';
import { checkDNSLeak } from '@/services/dns';
import { checkWebRTCLeak } from '@/services/webrtc';
import { getFingerprint } from '@/services/fingerprint';
import { getGPSPosition, calculateDistance } from '@/services/gps';
import { calculateRisk } from '@/services/risk';
import styles from './SuggestionCard.module.css';
import { useTranslation } from '@/i18n/context';
import { Lightbulb } from 'lucide-react';

export default function SuggestionCard() {
    const { t } = useTranslation();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function analyze() {
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

                setSuggestions(riskInfo.suggestions);
            } catch (error) {
                console.error("Error analyzing network:", error);
            } finally {
                setLoading(false);
            }
        }

        analyze();
    }, []);

    if (loading) {
        return (
            <div className="glass-card" style={{ gridColumn: 'span 2' }}>
                <div className={styles.loading}>{t.common.loading}</div>
            </div>
        );
    }

    return (
        <div className="glass-card">
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Lightbulb className={styles.icon} />
                        {t.suggestions.title}
                    </div>
                </div>

                <div className={styles.content}>
                    {suggestions.length === 0 ? (
                        <div className={styles.noSuggestions}>
                            {t.suggestions.perfect}
                        </div>
                    ) : (
                        suggestions.map((key, i) => (
                            <div key={i} className={styles.suggestionItem}>
                                <span className={styles.bullet}>●</span>
                                <div className={styles.suggestionContent}>
                                    <p className={styles.text}>
                                        {t.suggestions.items[key as keyof typeof t.suggestions.items] || key}
                                    </p>
                                    {key === 'WEBRTC_LEAK' && (
                                        <a
                                            href="https://chromewebstore.google.com/detail/webrtc-network-limiter/npeicpdbkakmehahjeeohfdhnlpdklia"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.link}
                                        >
                                            WebRTC Network Limiter ↗
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
