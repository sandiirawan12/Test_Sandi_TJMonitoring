import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTrips } from '../services/api';
import { DROPDOWN_PAGE_SIZE } from '../utils/constants';

export interface TripOption {
  id: string;
  headsign: string;
  routeId?: string;
  directionId?: number;
  wheelchairAccessible?: number;
}

export function useTrips(selectedRoutes: string[] = []) {
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prevRoutesRef = useRef('');

  const loadAll = useCallback(async (routes: string[]) => {
    if (routes.length === 0) {
      setTrips([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const allTrips: TripOption[] = [];
    let offset = 0;

    try {
      while (true) {
        const response = await fetchTrips({ routes, limit: DROPDOWN_PAGE_SIZE, offset });
        allTrips.push(...response.trips);
        if (!response.hasMore || response.trips.length === 0) break;
        offset = response.nextOffset;
      }
      const seen = new Set<string>();
      const unique = allTrips.filter((trip) => {
        if (seen.has(trip.id)) return false;
        seen.add(trip.id);
        return true;
      });
      setTrips(unique);
    } catch (error: any) {
      setError(error.message || 'Gagal memuat trip.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const key = [...selectedRoutes].sort().join(',');
    if (prevRoutesRef.current !== key) {
      prevRoutesRef.current = key;
      loadAll(selectedRoutes);
    }
  }, [selectedRoutes, loadAll]);

  return {
    trips,
    loading,
    retry: () => loadAll(selectedRoutes),
    error,
  };
}
