"use client";

import { useEffect, useState } from 'react';
import { getGPSPosition, calculateDistance, GPSInfo } from '@/services/gps';
import { getIPInfo } from '@/services/ip';
import styles from './GPSCard.module.css';
import { useTranslation } from '@/i18n/context';
import { MapPin } from 'lucide-react';
import Skeleton from './Skeleton';
import Globe from './Globe';

export default function GPSCard() {
    const { t } = useTranslation();
    const [info, setInfo] = useState<GPSInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch IP info first as it's more reliable
                const ipData = await getIPInfo().catch(err => {
                    console.error("IP Info failed:", err);
                    return { latitude: null, longitude: null };
                });

                // Try to get GPS, but don't fail the whole view if it fails
                const gpsData = await getGPSPosition().catch(err => {
                    console.error("GPS failed:", err);
                    return { latitude: null, longitude: null, accuracy: null, error: 'Failed to retrieve GPS', distanceFromIP: null };
                });

                let distance: number | null = null;
                if (gpsData.latitude && gpsData.longitude && ipData.latitude && ipData.longitude) {
                    distance = calculateDistance(gpsData.latitude, gpsData.longitude, ipData.latitude, ipData.longitude);
                }

                setInfo({
                    ...gpsData,
                    distanceFromIP: distance
                });
            } catch (error) {
                console.error("Critical error in GPSCard:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const requestLocation = () => {
        console.log("[GPSCard] Requesting location manually...");
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("[GPSCard] Manual success:", position);
                // Re-fetch everything to ensure we have fresh data and can calculate distance
                async function refreshData() {
                    const [gpsData, ipData] = await Promise.all([
                        getGPSPosition(),
                        getIPInfo()
                    ]);

                    let distance: number | null = null;
                    if (gpsData.latitude && gpsData.longitude && ipData.latitude && ipData.longitude) {
                        distance = calculateDistance(gpsData.latitude, gpsData.longitude, ipData.latitude, ipData.longitude);
                    }

                    setInfo({
                        ...gpsData,
                        distanceFromIP: distance
                    });
                    setLoading(false);
                }
                refreshData();
            },
            (error) => {
                console.error("[GPSCard] Manual error:", error);
                setLoading(false);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    if (loading) {
        return (
            <div className="glass-card">
                <div className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            <MapPin className={styles.icon} />
                            {t.gps.title}
                        </div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.grid}>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.gps.latitude}</span>
                                <Skeleton width="80%" height="1.2rem" />
                            </div>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.gps.longitude}</span>
                                <Skeleton width="80%" height="1.2rem" />
                            </div>
                            <div className={styles.item} style={{ gridColumn: 'span 2' }}>
                                <span className={styles.label}>{t.gps.fromIp}</span>
                                <Skeleton width="60%" height="1.2rem" />
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
                <div className={styles.globeContainer}>
                    <Globe />
                </div>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <MapPin className={styles.icon} />
                        {t.gps.title}
                    </div>
                    {info?.error && (
                        <span className={styles.badge} style={{
                            color: 'var(--danger)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: 'rgba(239, 68, 68, 0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            border: '1px solid'
                        }}>
                            {t.gps.accessDenied}
                        </span>
                    )}
                </div>

                <div className={styles.content}>
                    {!info?.latitude ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>
                                {t.gps.grantPermission}
                            </p>
                            <button onClick={requestLocation} className="btn-glass">
                                {t.gps.enable}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.gps.latitude}</span>
                                <span className={styles.value}>{info.latitude.toFixed(4)}</span>
                            </div>
                            <div className={styles.item}>
                                <span className={styles.label}>{t.gps.longitude}</span>
                                <span className={styles.value}>{info.longitude?.toFixed(4)}</span>
                            </div>
                            <div className={styles.item} style={{ gridColumn: 'span 2' }}>
                                <span className={styles.label}>{t.gps.fromIp}</span>
                                <span className={styles.value} style={{
                                    color: (info.distanceFromIP || 0) > 100 ? 'var(--warning)' : 'var(--success)'
                                }}>
                                    {info.distanceFromIP ? `${info.distanceFromIP} km` : t.common.unknown}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
