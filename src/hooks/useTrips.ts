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
        const res = await fetchTrips({ routes, limit: DROPDOWN_PAGE_SIZE, offset });
        allTrips.push(...res.trips);
        if (!res.hasMore || res.trips.length === 0) break;
        offset = res.nextOffset;
      }
      const seen = new Set<string>();
      const unique = allTrips.filter((t) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
      setTrips(unique);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat trip.');
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
