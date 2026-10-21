import React from 'react';
import { Route, Navigation, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import type { DropdownItem } from './MultiSelectDropdown';
import { useRoutes } from '../hooks/useRoutes';
import { useTrips } from '../hooks/useTrips';

interface FilterBarProps {
  selectedRoutes: string[];
  selectedTrips: string[];
  onRoutesChange: (routes: string[]) => void;
  onTripsChange: (trips: string[]) => void;
  onClearAll: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedRoutes,
  selectedTrips,
  onRoutesChange,
  onTripsChange,
  onClearAll,
}) => {
  const { routes, loading: routesLoading } = useRoutes();
  const { trips, loading: tripsLoading } = useTrips(selectedRoutes);

  const routeItems: DropdownItem[] = routes.map((routeItem) => ({
    id: routeItem.id,
    label: routeItem.shortName ? `${routeItem.shortName} - ${routeItem.longName}` : routeItem.longName,
    subLabel: routeItem.description || (routeItem.type === 3 ? 'Bus' : 'Layanan Transit'),
    color: routeItem.color,
    badge: routeItem.id,
  }));

  const tripItems: DropdownItem[] = trips.map((tripItem) => ({
    id: tripItem.id,
    label: tripItem.headsign,
    subLabel: `ID: ${tripItem.id}${tripItem.directionId != null ? ` (Arah ${tripItem.directionId})` : ''}`,
    badge: tripItem.id,
  }));

  const hasActiveFilters = selectedRoutes.length > 0 || selectedTrips.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filter Armada</span>
          {hasActiveFilters && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {selectedRoutes.length + selectedTrips.length} aktif
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MultiSelectDropdown
          label="Filter Rute"
          placeholder="Semua rute (bisa pilih banyak)"
          items={routeItems}
          selectedIds={selectedRoutes}
          onChange={onRoutesChange}
          loading={routesLoading}
          icon={<Route className="w-4 h-4" />}
        />

        <div className={`relative ${selectedRoutes.length === 0 ? 'pointer-events-none select-none' : ''}`}>
          {selectedRoutes.length === 0 && (
            <div className="absolute inset-0 z-10 bg-slate-50/70 rounded-xl cursor-not-allowed" />
          )}
          <MultiSelectDropdown
            label="Filter Trip"
            placeholder={
              selectedRoutes.length > 0
                ? `Trip dari ${selectedRoutes.length} rute terpilih`
                : 'Pilih rute terlebih dahulu...'
            }
            items={tripItems}
            selectedIds={selectedTrips}
            onChange={onTripsChange}
            loading={tripsLoading}
            icon={<Navigation className="w-4 h-4" />}
            disabled={selectedRoutes.length === 0}
            emptyMessage="Tidak ada trip untuk rute yang dipilih."
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1">Filter Aktif:</span>

          {selectedRoutes.map((routeId) => {
            const matchedRoute = routes.find((route) => route.id === routeId);
            return (
              <span
                key={routeId}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
              >
                {matchedRoute?.color && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: matchedRoute.color }}
                  />
                )}
                <span className="font-medium">
                  Rute: {matchedRoute ? matchedRoute.shortName || matchedRoute.longName : routeId}
                </span>
                <button
                  type="button"
                  onClick={() => onRoutesChange(selectedRoutes.filter((id) => id !== routeId))}
                  className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}

          {selectedTrips.map((tripId) => {
            const matchedTrip = trips.find((trip) => trip.id === tripId);
            return (
              <span
                key={tripId}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200"
              >
                <Navigation className="w-3 h-3 text-blue-600" />
                <span className="font-medium">
                  Trip: {matchedTrip ? matchedTrip.headsign : tripId}
                </span>
                <button
                  type="button"
                  onClick={() => onTripsChange(selectedTrips.filter((id) => id !== tripId))}
                  className="p-0.5 hover:bg-blue-100 rounded text-blue-400 hover:text-blue-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
