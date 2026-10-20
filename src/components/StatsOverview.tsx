import React from 'react';
import { Bus, Activity, Compass, Route } from 'lucide-react';
import type { VehicleStats } from '../services/api';

interface StatsOverviewProps {
  stats: VehicleStats;
  activeRoutesCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  activeRoutesCount,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Bus className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Total Armada
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {stats.total.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Sedang Jalan
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
            {stats.inTransit.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Berhenti
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">
            {stats.stopped.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Route className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Rute Terpilih
          </span>
          <span className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">
            {activeRoutesCount > 0 ? `${activeRoutesCount} Rute` : 'Semua'}
          </span>
        </div>
      </div>
    </div>
  );
};
