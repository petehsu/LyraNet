export interface WebRTCInfo {
    ip: string | null;
    leaking: boolean;
    error?: string;
}

export async function checkWebRTCLeak(): Promise<WebRTCInfo> {
    return new Promise((resolve) => {
        const rtc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        let leakedIP: string | null = null;

        rtc.createDataChannel('');

        rtc.onicecandidate = (e) => {
            if (!e.candidate) {
                // End of candidates
                resolve({
                    ip: leakedIP,
                    leaking: !!leakedIP
                });
                return;
            }

            const candidate = e.candidate.candidate;
            // Simple regex to find IP in candidate string
            const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
            if (ipMatch) {
                leakedIP = ipMatch[1];
                // If we found an IP, we can resolve early if we want, but let's wait for all candidates or timeout
            }
        };

        rtc.createOffer()
            .then(offer => rtc.setLocalDescription(offer))
            .catch(err => {
                resolve({
                    ip: null,
                    leaking: false,
                    error: 'WebRTC disabled or blocked'
                });
            });

        // Timeout in case no candidates are found or it hangs
        setTimeout(() => {
            resolve({
                ip: leakedIP,
                leaking: !!leakedIP
            });
            rtc.close();
        }, 2000);
    });
}
