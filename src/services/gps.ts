export interface GPSInfo {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
    distanceFromIP: number | null; // in km
}

export function getGPSPosition(): Promise<GPSInfo> {
    console.log("[GPS Service] Requesting GPS position...");
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.error("[GPS Service] Geolocation not supported");
            resolve({
                latitude: null,
                longitude: null,
                accuracy: null,
                error: 'Geolocation not supported',
                distanceFromIP: null
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("[GPS Service] Success:", position.coords);
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    error: null,
                    distanceFromIP: null // Calculated later
                });
            },
            (error) => {
                console.error("[GPS Service] Error:", error.code, error.message);
                let errorMessage = 'Unknown error';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Position unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Timeout';
                        break;
                }
                resolve({
                    latitude: null,
                    longitude: null,
                    accuracy: null,
                    error: errorMessage,
                    distanceFromIP: null
                });
            },
            { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
        );
    });
}

// Haversine formula to calculate distance between two points on Earth
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return Math.round(d);
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}
