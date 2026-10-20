import { useState, useEffect, useCallback } from 'react';
import type { EnrichedVehicle, PaginationInfo, FilterState } from '../types/mbta';
import { fetchVehicles, fetchVehicleStats } from '../services/api';
import type { VehicleStats } from '../services/api';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

interface UseVehiclesProps {
  initialPageSize?: number;
}

export function useVehicles({ initialPageSize = DEFAULT_PAGE_SIZE }: UseVehiclesProps = {}) {
  const [vehicles, setVehicles] = useState<EnrichedVehicle[]>([]);
  const [stats, setStats] = useState<VehicleStats>({
    total: 0,
    inTransit: 0,
    stopped: 0,
    incoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<FilterState>({
    selectedRoutes: [],
    selectedTrips: [],
  });

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: initialPageSize,
    totalItems: 0,
    totalPages: 1,
    startItem: 0,
    endItem: 0,
    hasNext: false,
    hasPrev: false,
  });

  const loadData = useCallback(
    async (isBackground = false) => {
      if (isBackground) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const [result, statsResult] = await Promise.all([
          fetchVehicles({
            page,
            pageSize,
            routes: filters.selectedRoutes,
            trips: filters.selectedTrips,
          }),
          fetchVehicleStats(filters.selectedRoutes, filters.selectedTrips),
        ]);

        const sorted = [...result.vehicles].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setVehicles(sorted);
        setStats(statsResult);

        // sync pagination total with stats
        const realTotal = statsResult.total || result.pagination.totalItems;
        const realTotalPages = Math.max(1, Math.ceil(realTotal / pageSize));
        setPagination({
          ...result.pagination,
          totalItems: realTotal,
          totalPages: realTotalPages,
          hasNext: page < realTotalPages,
        });
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data kendaraan.');
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [page, pageSize, filters.selectedRoutes, filters.selectedTrips]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const handleRoutesChange = useCallback((routes: string[]) => {
    setFilters((prev) => ({
      ...prev,
      selectedRoutes: routes,
      selectedTrips: prev.selectedTrips,
    }));
    setPage(1);
  }, []);

  const handleTripsChange = useCallback((trips: string[]) => {
    setFilters((prev) => ({
      ...prev,
      selectedTrips: trips,
    }));
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      selectedRoutes: [],
      selectedTrips: [],
    });
    setPage(1);
  }, []);

  return {
    vehicles,
    stats,
    loading,
    isRefreshing,
    error,
    pagination,
    filters,
    page,
    pageSize,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    setRoutes: handleRoutesChange,
    setTrips: handleTripsChange,
    clearFilters: handleClearFilters,
    refresh: () => loadData(true),
    retry: () => loadData(),
  };
}
