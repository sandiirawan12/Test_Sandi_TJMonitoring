import type {
  JsonApiResponse,
  VehicleResource,
  RouteResource,
  TripResource,
  EnrichedVehicle,
  PaginationInfo,
} from '../types/mbta';
import { API_BASE_URL, DEFAULT_PAGE_SIZE } from '../utils/constants';
import { formatDateTime, formatRelativeTime, formatStatusLabel } from '../utils/formatters';

export interface FetchVehiclesParams {
  page?: number;
  pageSize?: number;
  routes?: string[];
  trips?: string[];
  sort?: string;
}

export interface FetchVehiclesResult {
  vehicles: EnrichedVehicle[];
  pagination: PaginationInfo;
}

export interface FetchRoutesParams {
  limit?: number;
  offset?: number;
}

export interface FetchRoutesResult {
  routes: Array<{
    id: string;
    longName: string;
    shortName: string;
    color: string;
    textColor: string;
    description: string;
    type: number;
  }>;
  hasMore: boolean;
  nextOffset: number;
}

export interface FetchTripsParams {
  routes?: string[];
  limit?: number;
  offset?: number;
}

export interface FetchTripsResult {
  trips: Array<{
    id: string;
    headsign: string;
    routeId?: string;
    directionId?: number;
    wheelchairAccessible?: number;
  }>;
  hasMore: boolean;
  nextOffset: number;
}

export function normalizeVehicle(
  resource: VehicleResource,
  includedMap: Map<string, any>
): EnrichedVehicle {
  const attrs = resource.attributes;

  const routeRel = resource.relationships?.route?.data;
  const routeResource: RouteResource | undefined = routeRel
    ? includedMap.get(`route:${routeRel.id}`)
    : undefined;

  const tripRel = resource.relationships?.trip?.data;
  const tripResource: TripResource | undefined = tripRel
    ? includedMap.get(`trip:${tripRel.id}`)
    : undefined;

  const stopRel = resource.relationships?.stop?.data;
  const stopResource: any | undefined = stopRel
    ? includedMap.get(`stop:${stopRel.id}`)
    : undefined;

  return {
    id: resource.id,
    label: attrs.label || resource.id,
    status: attrs.current_status || 'UNKNOWN',
    statusDisplay: formatStatusLabel(attrs.current_status),
    latitude: attrs.latitude,
    longitude: attrs.longitude,
    updatedAt: attrs.updated_at,
    updatedAtFormatted: formatDateTime(attrs.updated_at),
    updatedAtRelative: formatRelativeTime(attrs.updated_at),
    bearing: attrs.bearing,
    speed: attrs.speed,
    occupancyStatus: attrs.occupancy_status,
    currentStopSequence: attrs.current_stop_sequence,
    directionId: attrs.direction_id,
    routeId: routeRel?.id || null,
    tripId: tripRel?.id || null,
    stopId: stopRel?.id || null,
    route: routeResource
      ? {
          id: routeResource.id,
          longName: routeResource.attributes.long_name || routeResource.id,
          shortName: routeResource.attributes.short_name || '',
          color: routeResource.attributes.color ? `#${routeResource.attributes.color}` : '#005696',
          textColor: routeResource.attributes.text_color ? `#${routeResource.attributes.text_color}` : '#ffffff',
          type: routeResource.attributes.type,
          description: routeResource.attributes.description || '',
        }
      : undefined,
    trip: tripResource
      ? {
          id: tripResource.id,
          headsign: tripResource.attributes.headsign || tripResource.id,
          name: tripResource.attributes.name || '',
          directionId: tripResource.attributes.direction_id,
          wheelchairAccessible: tripResource.attributes.wheelchair_accessible,
          bikesAllowed: tripResource.attributes.bikes_allowed,
        }
      : undefined,
    stop: stopResource
      ? {
          id: stopResource.id,
          name: stopResource.attributes.name || stopResource.id,
          municipality: stopResource.attributes.municipality || '',
        }
      : undefined,
  };
}

function calculatePagination(
  links: Record<string, string> | undefined,
  count: number,
  pageSize: number,
  offset: number
) {
  if (!links || !links.last) {
    const total = offset + count;
    return {
      totalItems: total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  }

  try {
    const url = new URL(links.last);
    const lastOffsetStr = url.searchParams.get('page[offset]');
    if (lastOffsetStr != null) {
      const lastOffset = parseInt(lastOffsetStr, 10);
      if (!isNaN(lastOffset)) {
        if (offset >= lastOffset) {
          const exactTotal = lastOffset + count;
          return {
            totalItems: exactTotal,
            totalPages: Math.max(1, Math.ceil(exactTotal / pageSize)),
          };
        }
        const estimatedTotal = lastOffset + pageSize;
        return {
          totalItems: estimatedTotal,
          totalPages: Math.max(1, Math.ceil(estimatedTotal / pageSize)),
        };
      }
    }
  } catch {
  }

  const fallbackTotal = offset + count + (links.next ? pageSize : 0);
  return {
    totalItems: fallbackTotal,
    totalPages: Math.max(1, Math.ceil(fallbackTotal / pageSize)),
  };
}

export async function fetchVehicles({
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  routes = [],
  trips = [],
  sort = '-updated_at',
}: FetchVehiclesParams = {}): Promise<FetchVehiclesResult> {
  const offset = (page - 1) * pageSize;
  const params = new URLSearchParams();

  params.set('page[limit]', String(pageSize));
  params.set('page[offset]', String(offset));
  params.set('sort', sort);
  params.set('include', 'route,trip,stop');

  if (routes.length > 0) {
    params.set('filter[route]', routes.join(','));
  }

  if (trips.length > 0) {
    params.set('filter[trip]', trips.join(','));
  }

  const endpoint = `${API_BASE_URL}/vehicles?${params.toString()}`;

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: 'application/vnd.api+json' },
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Limit request API tercapai. Tunggu beberapa detik lalu coba lagi.');
      }
      if (res.status === 400) {
        throw new Error('Filter data tidak valid.');
      }
      throw new Error(`Gagal memuat data dari server (HTTP ${res.status}).`);
    }

    const json: JsonApiResponse<VehicleResource[]> = await res.json();

    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0]?.detail || 'Gagal memproses data.');
    }

    const includedMap = new Map<string, any>();
    if (Array.isArray(json.included)) {
      for (const item of json.included) {
        includedMap.set(`${item.type}:${item.id}`, item);
      }
    }

    const raw = json.data || [];
    const vehicles: EnrichedVehicle[] = raw.map((vehicleItem) => normalizeVehicle(vehicleItem, includedMap));

    const { totalItems, totalPages } = calculatePagination(
      json.links as Record<string, string>,
      vehicles.length,
      pageSize,
      offset
    );

    return {
      vehicles,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
        startItem: vehicles.length > 0 ? offset + 1 : 0,
        endItem: vehicles.length > 0 ? offset + vehicles.length : 0,
        hasNext: Boolean(json.links?.next && page < totalPages),
        hasPrev: Boolean(json.links?.prev || page > 1),
      },
    };
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Koneksi terputus. Pastikan perangkat Anda terhubung ke internet.');
    }
    throw error;
  }
}

export async function fetchRoutes({
  limit = 20,
  offset = 0,
}: FetchRoutesParams = {}): Promise<FetchRoutesResult> {
  const params = new URLSearchParams();
  params.set('page[limit]', String(limit));
  params.set('page[offset]', String(offset));
  params.set('sort', 'sort_order');

  const endpoint = `${API_BASE_URL}/routes?${params.toString()}`;

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: 'application/vnd.api+json' },
    });

    if (!res.ok) {
      throw new Error(`Gagal memuat rute (HTTP ${res.status}).`);
    }

    const json: JsonApiResponse<RouteResource[]> = await res.json();
    const data = json.data || [];

    const routes = data.map((routeItem) => ({
      id: routeItem.id,
      longName: routeItem.attributes.long_name || routeItem.id,
      shortName: routeItem.attributes.short_name || '',
      color: routeItem.attributes.color ? `#${routeItem.attributes.color}` : '#005696',
      textColor: routeItem.attributes.text_color ? `#${routeItem.attributes.text_color}` : '#ffffff',
      description: routeItem.attributes.description || '',
      type: routeItem.attributes.type,
    }));

    return {
      routes,
      hasMore: Boolean(json.links?.next && data.length >= limit),
      nextOffset: offset + data.length,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil rute.');
  }
}

export async function fetchTrips({
  routes = [],
  limit = 20,
  offset = 0,
}: FetchTripsParams = {}): Promise<FetchTripsResult> {
  if (routes.length === 0) {
    return {
      trips: [],
      hasMore: false,
      nextOffset: 0,
    };
  }

  const params = new URLSearchParams();
  params.set('page[limit]', String(limit));
  params.set('page[offset]', String(offset));
  params.set('filter[route]', routes.join(','));

  const endpoint = `${API_BASE_URL}/trips?${params.toString()}`;

  try {
    const res = await fetch(endpoint, {
      headers: { Accept: 'application/vnd.api+json' },
    });

    if (!res.ok) {
      throw new Error(`Gagal memuat trip (HTTP ${res.status}).`);
    }

    const json: JsonApiResponse<TripResource[]> = await res.json();
    const data = json.data || [];

    const trips = data.map((tripItem) => ({
      id: tripItem.id,
      headsign: tripItem.attributes.headsign || `Trip #${tripItem.id}`,
      routeId: tripItem.relationships?.route?.data?.id,
      directionId: tripItem.attributes.direction_id,
      wheelchairAccessible: tripItem.attributes.wheelchair_accessible,
    }));

    return {
      trips,
      hasMore: Boolean(json.links?.next && data.length >= limit),
      nextOffset: offset + data.length,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Gagal mengambil trip.');
  }
}

export interface VehicleStats {
  total: number;
  inTransit: number;
  stopped: number;
  incoming: number;
}

export async function fetchVehicleStats(
  routes: string[] = [],
  trips: string[] = []
): Promise<VehicleStats> {
  const params = new URLSearchParams();
  params.set('fields[vehicle]', 'current_status');
  params.set('page[limit]', '1000');
  if (routes.length > 0) params.set('filter[route]', routes.join(','));
  if (trips.length > 0) params.set('filter[trip]', trips.join(','));

  try {
    const res = await fetch(`${API_BASE_URL}/vehicles?${params.toString()}`, {
      headers: { Accept: 'application/vnd.api+json' },
    });
    if (!res.ok) {
      return { total: 0, inTransit: 0, stopped: 0, incoming: 0 };
    }
    const json = await res.json();
    const data = json.data || [];
    let inTransit = 0;
    let stopped = 0;
    let incoming = 0;

    for (const vehicleItem of data) {
      const status = vehicleItem.attributes?.current_status;
      if (status === 'IN_TRANSIT_TO') inTransit++;
      else if (status === 'STOPPED_AT') stopped++;
      else if (status === 'INCOMING_AT') incoming++;
    }

    return {
      total: data.length,
      inTransit,
      stopped,
      incoming,
    };
  } catch {
    return { total: 0, inTransit: 0, stopped: 0, incoming: 0 };
  }
}
