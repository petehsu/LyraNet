export interface FingerprintInfo {
    userAgent: string;
    language: string;
    platform: string;
    timezone: string;
    screenResolution: string;
    canvasHash: string;
    isConsistent: boolean;
}

export async function getFingerprint(): Promise<FingerprintInfo> {
    // Canvas Fingerprinting
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let canvasHash = 'Unknown';

    if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px "Arial"';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('Hello World', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Hello World', 4, 17);

        const dataURL = canvas.toDataURL();
        // Simple hash function for demo
        let hash = 0;
        for (let i = 0; i < dataURL.length; i++) {
            const char = dataURL.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        canvasHash = hash.toString(16);
    }

    // Consistency Check (Timezone vs Locale)
    // This is a simplified check.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;

    // Basic heuristic: if timezone is Asia/Shanghai but language is en-US, it might be a proxy user who didn't change system language, 
    // but usually we check if timezone matches IP location. Since we don't have IP location here easily without passing it, 
    // we'll just return true for now or do a basic check.
    const isConsistent = true;

    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: timezone,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        canvasHash: canvasHash,
        isConsistent: isConsistent
    };
}
