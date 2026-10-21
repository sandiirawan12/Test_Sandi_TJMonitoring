import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRoutes } from '../services/api';
import { DROPDOWN_PAGE_SIZE } from '../utils/constants';

export interface RouteOption {
  id: string;
  longName: string;
  shortName: string;
  color: string;
  textColor: string;
  description: string;
  type: number;
}

export function useRoutes() {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialLoadedRef = useRef(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const allRoutes: RouteOption[] = [];
    let offset = 0;

    try {
      while (true) {
        const res = await fetchRoutes({ limit: DROPDOWN_PAGE_SIZE, offset });
        allRoutes.push(...res.routes);
        if (!res.hasMore || res.routes.length === 0) break;
        offset = res.nextOffset;
      }
      setRoutes(allRoutes);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat rute.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true;
      loadAll();
    }
  }, [loadAll]);

  return {
    routes,
    loading,
    retry: loadAll,
    error,
  };
}
