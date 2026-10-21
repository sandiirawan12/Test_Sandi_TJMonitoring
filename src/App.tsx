import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { StatsOverview } from './components/StatsOverview';
import { VehicleCard } from './components/VehicleCard';
import { VehicleModal } from './components/VehicleModal';
import { Pagination } from './components/Pagination';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { useVehicles } from './hooks/useVehicles';
import type { EnrichedVehicle } from './types/mbta';
import { Bus, FilterX } from 'lucide-react';

export function App() {
  const {
    vehicles,
    stats,
    loading,
    isRefreshing,
    error,
    pagination,
    filters,
    setPage,
    setPageSize,
    setRoutes,
    setTrips,
    clearFilters,
    refresh,
    retry,
  } = useVehicles();

  const [selectedVehicle, setSelectedVehicle] = useState<EnrichedVehicle | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onRefresh={refresh} isRefreshing={isRefreshing} />

      <main className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <StatsOverview
          stats={stats}
          activeRoutesCount={filters.selectedRoutes.length}
        />

        <FilterBar
          selectedRoutes={filters.selectedRoutes}
          selectedTrips={filters.selectedTrips}
          onRoutesChange={setRoutes}
          onTripsChange={setTrips}
          onClearAll={clearFilters}
        />

        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Daftar Bus
            </h2>
          </div>

          {isRefreshing && (
            <span className="text-xs text-blue-600 font-semibold animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Memperbarui data...
            </span>
          )}
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={retry} />
        ) : loading && !isRefreshing ? (
          <LoadingSkeleton count={pagination.pageSize || 5} />
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-6 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bus className="w-8 h-8 opacity-75" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Tidak Ada Bus Ditemukan
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Tidak ada bus yang sesuai dengan filter rute atau trip yang dipilih.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FilterX className="w-4 h-4" />
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSelect={setSelectedVehicle}
                />
              ))}
            </div>

            <Pagination
              pagination={pagination}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              isLoading={loading || isRefreshing}
            />
          </>
        )}
      </main>

      <VehicleModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />

      <footer className="bg-white border-t border-slate-200 mt-3 py-6 text-center text-xs text-slate-500">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span>Sistem Monitoring Transjakarta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
