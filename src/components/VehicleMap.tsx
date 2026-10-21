import React, { useEffect, useRef } from 'react';
import LEAFLET from 'leaflet';

interface VehicleMapProps {
  latitude: number;
  longitude: number;
  label: string;
  status: string;
  bearing?: number | null;
  routeColor?: string;
}

export const VehicleMap: React.FC<VehicleMapProps> = ({
  latitude,
  longitude,
  label,
  status,
  bearing,
  routeColor = '#005696',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LEAFLET.Map | null>(null);
  const markerRef = useRef<LEAFLET.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    delete (LEAFLET.Icon.Default.prototype as any)._getIconUrl;

    const rotationDeg = bearing != null ? bearing : 0;
    const customIcon = LEAFLET.divIcon({
      className: 'custom-fleet-marker',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 48px; height: 48px;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background-color: ${routeColor}; opacity: 0.25; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; transform: rotate(${rotationDeg}deg); transition: transform 0.4s ease;">
            ${bearing != null ? `
              <div style="position: absolute; top: -5px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 8px solid ${routeColor}; filter: drop-shadow(0 -1px 1px rgba(0,0,0,0.25)); z-index: 10;"></div>
            ` : ''}
            <div style="width: 36px; height: 36px; border-radius: 9999px; background-color: ${routeColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 6 2 7"/>
                <path d="M10 6h4"/>
                <path d="m22 7-2-1"/>
                <rect width="16" height="16" x="4" y="3" rx="2"/>
                <path d="M4 11h16"/>
                <path d="M8 15h.01"/>
                <path d="M16 15h.01"/>
                <path d="M6 19v2"/>
                <path d="M18 21v-2"/>
              </svg>
            </div>
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });

    if (!mapInstanceRef.current) {
      const map = LEAFLET.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([latitude, longitude], 15);

      LEAFLET.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = LEAFLET.marker([latitude, longitude], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; font-size: 13px; line-height: 1.4; padding: 2px;">
          <strong style="color: #002244; font-size: 14px;">Bus #${label}</strong><br/>
          <span style="color: #64748b;">Status: <strong>${status}</strong></span><br/>
          <span style="color: #64748b;">Posisi: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}</span>
          ${bearing != null ? `<br/><span style="color: #64748b;">Arah: ${bearing}°</span>` : ''}
        </div>
      `);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 250);

      return () => clearTimeout(timer);
    } else {
      mapInstanceRef.current.setView([latitude, longitude], 15);
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        markerRef.current.setIcon(customIcon);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [latitude, longitude, label, status, bearing, routeColor]);

  return (
    <div className="relative w-full h-full min-h-[260px] rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[260px]" />
    </div>
  );
};
