export interface SpeedTestResult {
    download: number;
    upload: number;
    ping: number;
    jitter: number;
    server: {
        name: string;
        location: string;
        distance: number;
    };
}

export interface SpeedTestServer {
    id: string;
    name: string;
    location: string;
    host: string;
}

const SERVERS: SpeedTestServer[] = [
    { id: 'us-west', name: 'Cloudflare', location: 'San Jose, CA', host: 'speed.cloudflare.com' },
    { id: 'us-east', name: 'AWS CloudFront', location: 'N. Virginia, US', host: 'aws.amazon.com' },
    { id: 'eu-central', name: 'Deutsche Telekom', location: 'Frankfurt, DE', host: 'speedtest.telekom.de' },
    { id: 'asia-east', name: 'Google Cloud', location: 'Tokyo, JP', host: 'google.com' },
];

export async function selectBestServer(): Promise<SpeedTestServer> {
    // Simulate pinging servers to find the best one
    // In a real app, we would do HEAD requests to these endpoints and measure latency
    return new Promise((resolve) => {
        setTimeout(() => {
            // Randomly select a "best" server for simulation
            const server = SERVERS[Math.floor(Math.random() * SERVERS.length)];
            resolve(server);
        }, 1500); // 1.5s delay to simulate "smart scheduling"
    });
}

export function runSmartSpeedTest(
    onProgress: (data: { download?: number; upload?: number; ping?: number; phase: 'download' | 'upload' | 'ping' }) => void
): Promise<SpeedTestResult> {
    return new Promise((resolve) => {
        let download = 0;
        let upload = 0;
        const ping = Math.floor(Math.random() * 20) + 5; // 5-25ms
        const jitter = Math.floor(Math.random() * 5);

        // Phase 1: Download (Simulated)
        let progress = 0;
        const dlInterval = setInterval(() => {
            progress += 2;
            download = Math.min(1000, download + Math.random() * 80); // Ramps up to ~1000
            onProgress({ download, phase: 'download' });

            if (progress >= 100) {
                clearInterval(dlInterval);

                // Phase 2: Upload (Simulated)
                let upProgress = 0;
                const upInterval = setInterval(() => {
                    upProgress += 4;
                    upload = Math.min(500, upload + Math.random() * 40);
                    onProgress({ download, upload, phase: 'upload' });

                    if (upProgress >= 100) {
                        clearInterval(upInterval);
                        resolve({
                            download,
                            upload,
                            ping,
                            jitter,
                            server: {
                                name: 'Cloudflare Edge',
                                location: 'Auto-detected',
                                distance: 12
                            }
                        });
                    }
                }, 50);
            }
        }, 50);
    });
}
