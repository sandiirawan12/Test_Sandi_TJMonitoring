import React, { useState } from 'react';
import { MapPin, Clock, ArrowRight, Copy, Check } from 'lucide-react';
import type { EnrichedVehicle } from '../types/mbta';
import { StatusBadge } from './StatusBadge';
import { formatCoordinates } from '../utils/formatters';

interface VehicleCardProps {
  vehicle: EnrichedVehicle;
  onSelect: (vehicle: EnrichedVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCoords = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (vehicle.latitude != null && vehicle.longitude != null) {
      navigator.clipboard.writeText(`${vehicle.latitude}, ${vehicle.longitude}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const routeColor = vehicle.route?.color || '#005696';

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
        style={{ backgroundColor: routeColor }}
      />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base tracking-tight group-hover:text-blue-600 transition-colors">
                Bus #{vehicle.label}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                ID: {vehicle.id}
              </p>
            </div>
          </div>

          <StatusBadge status={vehicle.status} size="sm" />
        </div>

        <div className="mb-4 space-y-1.5">
          {vehicle.route ? (
            <div className="flex items-center gap-1.5">
              <span
                className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wide"
                style={{
                  backgroundColor: routeColor,
                  color: vehicle.route.textColor || '#ffffff',
                }}
              >
                {vehicle.route.shortName || vehicle.route.id}
              </span>
              <span className="text-xs font-medium text-slate-700 truncate" title={vehicle.route.longName}>
                {vehicle.route.longName}
              </span>
            </div>
          ) : (
            <span className="inline-block text-xs text-slate-400 italic">
              Belum ada info rute
            </span>
          )}

          {vehicle.trip && (
            <p className="text-[11px] text-slate-500 truncate" title={`Tujuan: ${vehicle.trip.headsign}`}>
              <span className="font-medium text-slate-600">Tujuan:</span> {vehicle.trip.headsign}
            </p>
          )}
        </div>

        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-mono text-[11px] truncate">
              {formatCoordinates(vehicle.latitude, vehicle.longitude)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCoords}
            title="Salin koordinat"
            className="p-1 rounded hover:bg-white text-slate-400 hover:text-slate-700 transition-colors shrink-0"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
        <div
          className="flex items-center gap-1.5 text-slate-400 text-[11px]"
          title={`Update: ${vehicle.updatedAtFormatted}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{vehicle.updatedAtRelative}</span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform text-xs">
          Lihat Detail
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
