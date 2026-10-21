import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Compass,
  Gauge,
  Users,
  Route,
  Navigation,
  Accessibility,
  ExternalLink,
  Building2,
} from 'lucide-react';
import type { EnrichedVehicle } from '../types/mbta';
import { StatusBadge } from './StatusBadge';
import { VehicleMap } from './VehicleMap';
import {
  formatCoordinates,
  formatSpeed,
  formatOccupancy,
  getBearingDirection,
} from '../utils/formatters';

interface VehicleModalProps {
  vehicle: EnrichedVehicle | null;
  onClose: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (vehicle) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [vehicle, onClose]);

  if (!vehicle) return null;

  const routeColor = vehicle.route?.color || '#005696';
  const occupancyInfo = formatOccupancy(vehicle.occupancyStatus);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">
                  Bus #{vehicle.label}
                </h2>
                <StatusBadge status={vehicle.status} size="md" />
              </div>
              <p className="text-xs text-slate-500 font-mono">
                ID Kendaraan: {vehicle.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Posisi Bus
              </span>
              {vehicle.latitude != null && vehicle.longitude != null && (
                <a
                  href={`https://www.google.com/maps?q=${vehicle.latitude},${vehicle.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {vehicle.latitude != null && vehicle.longitude != null ? (
              <div className="h-64 w-full">
                <VehicleMap
                  latitude={vehicle.latitude}
                  longitude={vehicle.longitude}
                  label={vehicle.label}
                  status={vehicle.statusDisplay}
                  bearing={vehicle.bearing}
                  routeColor={routeColor}
                />
              </div>
            ) : (
              <div className="h-32 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
                Peta tidak tersedia (koordinat GPS kosong).
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Gauge className="w-3.5 h-3.5 text-blue-500" />
                Kecepatan
              </span>
              <p className="text-base font-bold text-slate-900">
                {formatSpeed(vehicle.speed)}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                Kapasitas
              </span>
              <p className={`text-xs font-bold leading-snug ${occupancyInfo.color}`}>
                {occupancyInfo.text}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                Arah (Bearing)
              </span>
              <p className="text-xs font-bold text-slate-900">
                {getBearingDirection(vehicle.bearing)}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Update Terakhir
              </span>
              <p className="text-xs font-bold text-slate-900" title={vehicle.updatedAtFormatted}>
                {vehicle.updatedAtRelative}
              </p>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-blue-900 font-semibold block mb-0.5">
                Status Saat Ini: {vehicle.statusDisplay}
              </span>
              <span className="text-slate-600 font-mono">
                Koordinat: {formatCoordinates(vehicle.latitude, vehicle.longitude)}
              </span>
            </div>

            <div className="text-slate-500 text-left sm:text-right">
              <span className="block text-[11px]">Waktu Update:</span>
              <span className="font-semibold text-slate-700">{vehicle.updatedAtFormatted}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Route className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Informasi Rute
                </h3>
              </div>

              {vehicle.route ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Nama Rute:</span>
                    <span className="font-bold text-slate-800 text-right">
                      {vehicle.route.longName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Kode Trayek:</span>
                    <span
                      className="px-2 py-0.5 rounded font-mono font-bold text-[11px]"
                      style={{
                        backgroundColor: routeColor,
                        color: vehicle.route.textColor || '#ffffff',
                      }}
                    >
                      {vehicle.route.shortName || vehicle.route.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ID Rute:</span>
                    <span className="font-mono text-slate-700">{vehicle.route.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tipe Layanan:</span>
                    <span className="font-medium text-slate-800">
                      {vehicle.route.type === 3
                        ? 'Bus Rapid Transit (BRT)'
                        : vehicle.route.description || 'Layanan Transit'}
                    </span>
                  </div>

                  {vehicle.route.description && (
                    <div className="pt-1 text-slate-500 text-[11px] leading-relaxed">
                      {vehicle.route.description}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada data rute untuk kendaraan ini.
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Navigation className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Informasi Trip
                </h3>
              </div>

              {vehicle.trip ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tujuan Akhir:</span>
                    <span className="font-bold text-slate-800 text-right">
                      {vehicle.trip.headsign}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ID Trip:</span>
                    <span className="font-mono text-slate-700">{vehicle.trip.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Arah:</span>
                    <span className="font-medium text-slate-800">
                      {vehicle.directionId === 0
                        ? 'Keluar / Outbound'
                        : vehicle.directionId === 1
                          ? 'Masuk / Inbound'
                          : `Arah ${vehicle.directionId ?? '-'}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Accessibility className="w-3.5 h-3.5 text-slate-400" />
                      Akses Kursi Roda:
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {vehicle.trip.wheelchairAccessible === 1
                        ? 'Tersedia'
                        : 'Standar'}
                    </span>
                  </div>

                  {vehicle.currentStopSequence != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Urutan Halte:
                      </span>
                      <span className="font-mono text-slate-800">
                        Halte ke-{vehicle.currentStopSequence}
                        {vehicle.stop?.name ? ` (${vehicle.stop.name})` : ''}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada data trip untuk kendaraan ini.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500">
            Sumber Data: REST API MBTA (Live)
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
