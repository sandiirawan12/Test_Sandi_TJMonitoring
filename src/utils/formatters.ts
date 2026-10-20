export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return isoString || '-';
  }
}

export function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';

    const diffInSeconds = Math.round((Date.now() - date.getTime()) / 1000);

    if (diffInSeconds < 10) return 'Baru saja';
    if (diffInSeconds < 60) return `${diffInSeconds} dtk lalu`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} mnt lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  } catch {
    return '-';
  }
}

export function formatStatusLabel(status?: string | null): string {
  if (!status) return 'Tidak Diketahui';
  switch (status.toUpperCase()) {
    case 'IN_TRANSIT_TO':
      return 'Sedang Jalan';
    case 'STOPPED_AT':
      return 'Berhenti';
    case 'INCOMING_AT':
      return 'Mendekati Halte';
    default:
      return status.replace(/_/g, ' ');
  }
}

export function getStatusTheme(status?: string | null) {
  switch (status?.toUpperCase()) {
    case 'IN_TRANSIT_TO':
      return {
        bg: 'bg-emerald-50 text-emerald-700',
        border: 'border-emerald-200',
        dotBg: 'bg-emerald-500',
        pulse: true,
      };
    case 'STOPPED_AT':
      return {
        bg: 'bg-amber-50 text-amber-700',
        border: 'border-amber-200',
        dotBg: 'bg-amber-500',
        pulse: false,
      };
    case 'INCOMING_AT':
      return {
        bg: 'bg-sky-50 text-sky-700',
        border: 'border-sky-200',
        dotBg: 'bg-sky-500',
        pulse: true,
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700',
        border: 'border-slate-200',
        dotBg: 'bg-slate-400',
        pulse: false,
      };
  }
}

export function formatCoordinates(lat?: number | null, lng?: number | null): string {
  if (lat == null || lng == null) return 'Koordinat tidak tersedia';
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function formatSpeed(speedInMetersPerSecond?: number | null): string {
  if (speedInMetersPerSecond == null) return '0 km/jam';
  const kmh = Math.round(speedInMetersPerSecond * 3.6);
  return `${kmh} km/jam`;
}

export function formatOccupancy(occupancy?: string | null) {
  if (!occupancy) return { text: 'Tidak ada data', color: 'text-slate-500' };
  switch (occupancy.toUpperCase()) {
    case 'EMPTY':
      return { text: 'Kosong', color: 'text-emerald-600' };
    case 'MANY_SEATS_AVAILABLE':
      return { text: 'Banyak Kursi Kosong', color: 'text-emerald-600' };
    case 'FEW_SEATS_AVAILABLE':
      return { text: 'Sisa Sedikit Kursi', color: 'text-yellow-600' };
    case 'STANDING_ROOM_ONLY':
      return { text: 'Hanya Ruang Berdiri', color: 'text-orange-600' };
    case 'CRUSHED_STANDING_ROOM_ONLY':
      return { text: 'Sangat Padat', color: 'text-red-600' };
    case 'FULL':
      return { text: 'Penuh', color: 'text-red-700' };
    default:
      return { text: occupancy.replace(/_/g, ' '), color: 'text-slate-600' };
  }
}

export function getBearingDirection(bearing?: number | null): string {
  if (bearing == null) return '-';
  const directions = [
    'Utara (N)',
    'Timur Laut (NE)',
    'Timur (E)',
    'Tenggara (SE)',
    'Selatan (S)',
    'Barat Daya (SW)',
    'Barat (W)',
    'Barat Laut (NW)',
  ];
  const index = Math.round(((bearing % 360) / 45)) % 8;
  return `${directions[index]} (${bearing}°)`;
}
