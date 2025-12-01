"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './SpeedTestCard.module.css';
import { useTranslation } from '@/i18n/context';
import { Gauge, ArrowDown, ArrowUp, Activity, Server, Zap } from 'lucide-react';
import { selectBestServer, runSmartSpeedTest, SpeedTestServer } from '@/services/speedTest';

export default function SpeedTestCard() {
    const { t } = useTranslation();
    const [testing, setTesting] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [server, setServer] = useState<SpeedTestServer | null>(null);
    const [download, setDownload] = useState<number | null>(null);
    const [upload, setUpload] = useState<number | null>(null);
    const [ping, setPing] = useState<number | null>(null);
    const hasAutoStarted = useRef(false);

    const startTest = async () => {
        if (testing) return;
        setTesting(true);
        setDownload(0);
        setUpload(0);
        setPing(0);
        setServer(null);

        // Phase 1: Smart Scheduling
        setStatus(t.speedTest.selecting);
        const bestServer = await selectBestServer();
        setServer(bestServer);

        // Phase 2: Optimization
        setStatus(t.speedTest.optimizing);
        await new Promise(r => setTimeout(r, 800));

        // Phase 3: Testing
        setStatus(t.speedTest.testing);
        await runSmartSpeedTest((data) => {
            if (data.download !== undefined) setDownload(data.download);
            if (data.upload !== undefined) setUpload(data.upload);
            if (data.ping !== undefined) setPing(data.ping);
        });

        setTesting(false);
        setStatus(t.speedTest.idle);
    };

    useEffect(() => {
        if (!hasAutoStarted.current) {
            hasAutoStarted.current = true;
            startTest();
        }
    }, []);

    return (
        <div className="glass-card">
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Gauge className={styles.icon} />
                        {t.speedTest.title}
                    </div>
                    {testing && (
                        <div className={styles.statusBadge}>
                            <Activity size={12} className="spin" />
                            {status}
                        </div>
                    )}
                </div>

                <div className={styles.content}>
                    <div className={styles.gaugeContainer}>
                        <div className={styles.speedValue}>
                            {download ? download.toFixed(1) : '--'}
                        </div>
                        <div className={styles.speedUnit}>{t.speedTest.mbps}</div>
                        {server && (
                            <div className={styles.serverInfo}>
                                <Server size={10} />
                                {server.name} • {server.location}
                            </div>
                        )}
                    </div>

                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>{t.speedTest.ping}</span>
                            <span className={styles.statValue}>
                                {ping ? `${ping} ${t.speedTest.ms}` : '--'}
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>{t.speedTest.upload}</span>
                            <span className={styles.statValue}>
                                {upload ? `${upload.toFixed(1)}` : '--'}
                            </span>
                        </div>
                    </div>

                    <button
                        className={styles.startButton}
                        onClick={startTest}
                        disabled={testing}
                    >
                        {testing ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Zap size={14} className={styles.iconSpin} />
                                {t.speedTest.smartSchedule}...
                            </span>
                        ) : t.speedTest.restart}
                    </button>
                </div>
            </div>
        </div>
    );
}
