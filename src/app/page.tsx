"use client";

import { useState } from "react";
import IPCard from "@/components/IPCard";
import DNSCard from "@/components/DNSCard";
import WebRTCCard from "@/components/WebRTCCard";
import FingerprintCard from "@/components/FingerprintCard";
import RiskCard from "@/components/RiskCard";
import SuggestionCard from "@/components/SuggestionCard";
import SpeedTestCard from "@/components/SpeedTestCard";
import GPSCard from "@/components/GPSCard";
import { useTranslation } from "@/i18n/context";

export default function Home() {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container">
      <div key={refreshKey} className="bento-grid">
        {/* Row 1: Risk (1), Suggestions (1), Speed (1), IP (1) */}
        <div style={{ gridColumn: "span 1" }}>
          <RiskCard onScan={handleRefresh} />
        </div>
        <div style={{ gridColumn: "span 1" }}>
          <SuggestionCard />
        </div>
        <div style={{ gridColumn: "span 1" }}>
          <SpeedTestCard />
        </div>
        <div style={{ gridColumn: "span 1" }}>
          <IPCard />
        </div>

        {/* Row 2: GPS, DNS, WebRTC, Fingerprint (1 each) */}
        <div style={{ gridColumn: "span 1" }}>
          <GPSCard />
        </div>
        <div style={{ gridColumn: "span 1" }}>
          <DNSCard />
        </div>
        <div style={{ gridColumn: "span 1" }}>
          <WebRTCCard />
        </div>
        <div style={{ gridColumn: "span 1" }}>
          <FingerprintCard />
        </div>
      </div>
    </div>
  );
}
