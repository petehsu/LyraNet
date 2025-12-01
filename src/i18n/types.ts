export type Locale = 'en' | 'zh';

export interface Translations {
    header: {
        dashboard: string;
        tools: string;
        about: string;
        systemOnline: string;
    };
    common: {
        loading: string;
        unknown: string;
        reScan: string;
    };
    hero: {
        title: string;
        subtitle: string;
    };
    ip: {
        title: string;
        ip: string;
        location: string;
        isp: string;
        asn: string;
        timezone: string;
        proxy: string;
        hosting: string;
        type: string;
        types: {
            residential: string;
            datacenter: string;
            business: string;
            unknown: string;
        };
        status: {
            clean: string;
            proxy: string;
        };
    };
    risk: {
        title: string;
        score: string;
        level: string;
        factors: string;
        noFactors: string;
        levels: {
            low: string;
            medium: string;
            high: string;
            critical: string;
        };
        factorMap: Record<string, string>;
        suggestionMap: Record<string, string>;
    };
    dns: {
        title: string;
        servers: string;
        provider: string;
        status: string;
        leaking: string;
        secure: string;
    };
    webrtc: {
        title: string;
        localIP: string;
        status: string;
        leaking: string;
        secure: string;
    };
    fingerprint: {
        title: string;
        userAgent: string;
        language: string;
        platform: string;
        resolution: string;
        timezone: string;
        canvasHash: string;
        consistency: string;
        consistent: string;
        suspicious: string;
    };
    gps: {
        title: string;
        enable: string;
        locating: string;
        grantPermission: string;
        latitude: string;
        longitude: string;
        status: string;
        accessDenied: string;
        located: string;
        fromIp: string;
        match: string;
        mismatch: string;
    };
    speedTest: {
        title: string;
        start: string;
        retest: string;
        download: string;
        upload: string;
        ping: string;
        jitter: string;
        mbps: string;
        ms: string;
        testing: string;
        idle: string;
        selecting: string;
        optimizing: string;
        server: string;
        smartSchedule: string;
    };
    suggestions: {
        title: string;
        perfect: string;
        items: {
            IP_PROXY: string;
            DNS_LEAK: string;
            WEBRTC_LEAK: string;
            FP_INCONSISTENT: string;
            GPS_MISMATCH: string;
            IP_DATACENTER: string;
        };
    };
    about: {
        title: string;
        subtitle: string;
        security: {
            title: string;
            desc: string;
        };
        performance: {
            title: string;
            desc: string;
        };
        insight: {
            title: string;
            desc: string;
        };
        viewOnGithub: string;
    };
}
