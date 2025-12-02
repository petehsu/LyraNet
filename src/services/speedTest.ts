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

const CLOUDFLARE_ENDPOINT = 'https://speed.cloudflare.com';

export async function selectBestServer(): Promise<SpeedTestServer> {
    // For real testing, we use Cloudflare's Anycast network which automatically routes to the nearest server
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 'auto',
                name: 'Cloudflare Global',
                location: 'Auto-detected',
                host: 'speed.cloudflare.com'
            });
        }, 800);
    });
}

async function measurePing(): Promise<{ ping: number; jitter: number }> {
    const pings: number[] = [];
    // Ping 5 times
    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        try {
            await fetch(`${CLOUDFLARE_ENDPOINT}/__down?bytes=0&t=${Date.now()}`, { mode: 'cors', cache: 'no-store' });
            const end = performance.now();
            pings.push(end - start);
        } catch (e) {
            console.error('Ping failed', e);
        }
    }

    if (pings.length === 0) return { ping: 0, jitter: 0 };

    const minPing = Math.min(...pings);
    const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
    // Calculate jitter (mean deviation)
    const jitter = pings.reduce((a, b) => a + Math.abs(b - avgPing), 0) / pings.length;

    return { ping: Math.round(minPing), jitter: Math.round(jitter) };
}

async function measureDownload(onProgress: (mbps: number) => void): Promise<number> {
    // Download ~10MB
    const size = 10 * 1024 * 1024;
    const startTime = performance.now();

    try {
        const response = await fetch(`${CLOUDFLARE_ENDPOINT}/__down?bytes=${size}`, { mode: 'cors', cache: 'no-store' });
        const reader = response.body?.getReader();
        if (!reader) return 0;

        let receivedLength = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            receivedLength += value.length;

            const currentTime = performance.now();
            const duration = (currentTime - startTime) / 1000; // seconds
            if (duration > 0.1) { // Update only if enough time passed to avoid Infinity
                const mbps = (receivedLength * 8) / (duration * 1000 * 1000);
                onProgress(mbps);
            }
        }

        const totalTime = (performance.now() - startTime) / 1000;
        return (size * 8) / (totalTime * 1000 * 1000);
    } catch (e) {
        console.error('Download test failed', e);
        return 0;
    }
}

async function measureUpload(onProgress: (mbps: number) => void): Promise<number> {
    // Upload ~5MB
    const size = 5 * 1024 * 1024;
    const data = new Uint8Array(size);
    const startTime = performance.now();

    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${CLOUDFLARE_ENDPOINT}/__up`);

        xhr.upload.onprogress = (event) => {
            const duration = (performance.now() - startTime) / 1000;
            if (duration > 0.1) {
                const mbps = (event.loaded * 8) / (duration * 1000 * 1000);
                onProgress(mbps);
            }
        };

        xhr.onload = () => {
            const totalTime = (performance.now() - startTime) / 1000;
            const mbps = (size * 8) / (totalTime * 1000 * 1000);
            resolve(mbps);
        };

        xhr.onerror = () => {
            console.error('Upload test failed');
            resolve(0);
        };

        xhr.send(data);
    });
}

export async function runSmartSpeedTest(
    onProgress: (data: { download?: number; upload?: number; ping?: number; phase: 'download' | 'upload' | 'ping' }) => void
): Promise<SpeedTestResult> {

    // 1. Ping Test
    const { ping, jitter } = await measurePing();
    onProgress({ ping, phase: 'ping' });

    // 2. Download Test
    const download = await measureDownload((mbps) => {
        onProgress({ download: mbps, phase: 'download' });
    });

    // 3. Upload Test
    const upload = await measureUpload((mbps) => {
        onProgress({ upload: mbps, phase: 'upload' });
    });

    return {
        download,
        upload,
        ping,
        jitter,
        server: {
            name: 'Cloudflare Global',
            location: 'Nearest Node',
            distance: 0
        }
    };
}
