export interface RiskInfo {
    score: number; // 0-100, higher is riskier
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: string[];
    suggestions: string[];
}

export function calculateRisk(
    ipProxy: boolean,
    dnsLeak: boolean,
    webrtcLeak: boolean,
    fingerprintConsistent: boolean,
    gpsDistance: number | null,
    ipType: 'residential' | 'datacenter' | 'business' | 'unknown'
): RiskInfo {
    let score = 0;
    const factors: string[] = [];
    const suggestions: string[] = [];

    if (ipProxy) {
        score += 40;
        factors.push('IP_PROXY');
        suggestions.push('IP_PROXY');
    }

    if (ipType === 'datacenter') {
        score += 20;
        factors.push('IP_DATACENTER');
        suggestions.push('IP_DATACENTER');
    }

    if (dnsLeak) {
        score += 30;
        factors.push('DNS_LEAK');
        suggestions.push('DNS_LEAK');
    }

    if (webrtcLeak) {
        score += 20;
        factors.push('WEBRTC_LEAK');
        suggestions.push('WEBRTC_LEAK');
    }

    if (!fingerprintConsistent) {
        score += 10;
        factors.push('FP_INCONSISTENT');
        suggestions.push('FP_INCONSISTENT');
    }

    if (gpsDistance !== null && gpsDistance > 100) {
        score += 50; // High risk factor
        factors.push('GPS_MISMATCH');
        suggestions.push('GPS_MISMATCH');
    }

    if (score === 0) {
        // suggestions.push('CLEAN'); // Handled in UI if empty
    }

    let level: RiskInfo['level'] = 'Low';
    if (score > 80) level = 'Critical';
    else if (score > 50) level = 'High';
    else if (score > 20) level = 'Medium';

    return {
        score: Math.min(100, score), // Cap at 100
        level,
        factors,
        suggestions
    };
}
