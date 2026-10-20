export type VehicleStatus = 'IN_TRANSIT_TO' | 'STOPPED_AT' | 'INCOMING_AT' | string;

export interface VehicleAttributes {
  bearing: number | null;
  current_status: VehicleStatus;
  current_stop_sequence: number | null;
  direction_id: number | null;
  label: string | null;
  latitude: number | null;
  longitude: number | null;
  occupancy_status: string | null;
  revenue: string | null;
  speed: number | null;
  updated_at: string;
}

export interface ResourceRelationship {
  data: {
    id: string;
    type: string;
  } | null;
}

export interface VehicleRelationships {
  route?: ResourceRelationship;
  trip?: ResourceRelationship;
  stop?: ResourceRelationship;
}

export interface RouteAttributes {
  color: string;
  description: string;
  direction_destinations: string[];
  direction_names: string[];
  fare_class: string;
  long_name: string;
  short_name: string;
  sort_order: number;
  text_color: string;
  type: number;
}

export interface TripAttributes {
  bikes_allowed?: number;
  block_id?: string;
  direction_id?: number;
  headsign: string;
  name?: string;
  revenue?: string;
  wheelchair_accessible?: number;
}

export interface StopAttributes {
  address?: string | null;
  latitude: number;
  longitude: number;
  municipality?: string | null;
  name: string;
}

export interface JsonApiResource<TAttributes, TRelationships = Record<string, ResourceRelationship>> {
  id: string;
  type: string;
  attributes: TAttributes;
  relationships?: TRelationships;
}

export type VehicleResource = JsonApiResource<VehicleAttributes, VehicleRelationships>;
export type RouteResource = JsonApiResource<RouteAttributes>;
export type TripResource = JsonApiResource<TripAttributes>;
export type StopResource = JsonApiResource<StopAttributes>;

export interface JsonApiResponse<TData> {
  data: TData;
  included?: any[];
  links?: {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
  };
  errors?: Array<{
    code?: string;
    status?: string;
    detail?: string;
  }>;
}

export interface EnrichedVehicle {
  id: string;
  label: string;
  status: VehicleStatus;
  statusDisplay: string;
  latitude: number | null;
  longitude: number | null;
  updatedAt: string;
  updatedAtFormatted: string;
  updatedAtRelative: string;
  bearing: number | null;
  speed: number | null;
  occupancyStatus: string | null;
  currentStopSequence: number | null;
  directionId: number | null;
  routeId: string | null;
  tripId: string | null;
  stopId: string | null;
  route?: {
    id: string;
    longName: string;
    shortName: string;
    color: string;
    textColor: string;
    type: number;
    description: string;
  };
  trip?: {
    id: string;
    headsign: string;
    name: string;
    directionId?: number;
    wheelchairAccessible?: number;
    bikesAllowed?: number;
  };
  stop?: {
    id: string;
    name: string;
    municipality?: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterState {
  selectedRoutes: string[];
  selectedTrips: string[];
}
