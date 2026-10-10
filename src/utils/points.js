export const DEFAULT_PRESENCE_POINTS = 0;
export const POINTS_HISTORY_LIMIT = 50;

export function getPresencePoints(settings) {
  return Number.isFinite(settings?.points)
    ? settings.points
    : DEFAULT_PRESENCE_POINTS;
}

export function getLocalDateKey(timestamp = Date.now()) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addPointsHistory(
  settings,
  label,
  amount,
  timestamp = Date.now(),
  details = {}
) {
  const entry = {
    id: `${timestamp}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    label,
    amount,
    timestamp,
    type: details.type || (amount < 0 ? 'spend' : 'earn'),
    ...(details.item ? { item: details.item } : {}),
  };

  return [entry, ...(Array.isArray(settings?.pointsHistory) ? settings.pointsHistory : [])]
    .slice(0, POINTS_HISTORY_LIMIT);
}
