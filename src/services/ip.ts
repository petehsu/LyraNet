export interface IPInfo {
    ip: string;
    country: string;
    city: string;
    isp: string;
    asn: string;
    timezone: string;
    proxy: boolean;
    hosting: boolean;
    type: 'residential' | 'datacenter' | 'business' | 'unknown';
    latitude?: number;
    longitude?: number;
}

function isDatacenter(name: string): boolean {
    const lowerName = name.toLowerCase();
    return lowerName.includes('cloud') ||
        lowerName.includes('hosting') ||
        lowerName.includes('data center') ||
        lowerName.includes('datacenter') ||
        lowerName.includes('server') ||
        lowerName.includes('vps') ||
        lowerName.includes('dedicated') ||
        lowerName.includes('compute');
}

export async function getIPInfo(): Promise<IPInfo> {
    // Try ipwho.is first (reliable, free, no key)
    try {
        const res = await fetch('https://ipwho.is/');
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                // Determine type based on available data
                // ipwho.is doesn't give explicit type in free tier, so we infer
                // If it's hosting, it's likely datacenter
                let type: IPInfo['type'] = 'residential';
                const companyName = (data.connection?.isp || '') + ' ' + (data.connection?.org || '');
                if (isDatacenter(companyName)) {
                    type = 'datacenter';
                }

                return {
                    ip: data.ip,
                    country: data.country,
                    city: data.city,
                    isp: data.connection?.isp || data.connection?.org || 'Unknown',
                    asn: data.connection?.asn ? `AS${data.connection.asn}` : 'Unknown',
                    timezone: data.timezone?.id || 'Unknown',
                    proxy: false,
                    hosting: type === 'datacenter',
                    type: type,
                    latitude: data.latitude,
                    longitude: data.longitude
                };
            }
        }
    } catch (e) {
        console.warn('ipwho.is failed, trying fallback...');
    }

    // Fallback to ipapi.co
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
            const data = await res.json();
            // ipapi.co free tier also limited, inferring
            let type: IPInfo['type'] = 'residential';
            const companyName = (data.org || '') + ' ' + (data.isp || '');
            const lowerName = companyName.toLowerCase();

            if (isDatacenter(companyName) ||
                lowerName.includes('digitalocean') ||
                lowerName.includes('amazon') ||
                lowerName.includes('google') ||
                lowerName.includes('microsoft') ||
                lowerName.includes('oracle') ||
                lowerName.includes('alibaba')) {
                type = 'datacenter';
            }

            return {
                ip: data.ip,
                country: data.country_name,
                city: data.city,
                isp: data.org,
                asn: data.asn,
                timezone: data.timezone,
                proxy: false,
                hosting: type === 'datacenter',
                type: type,
                latitude: data.latitude,
                longitude: data.longitude
            };
        }
    } catch (error) {
        console.error('All IP providers failed:', error);
    }

    return {
        ip: 'Unknown',
        country: 'Unknown',
        city: 'Unknown',
        isp: 'Unknown',
        asn: 'Unknown',
        timezone: 'Unknown',
        proxy: false,
        hosting: false,
        type: 'unknown'
    };
}
