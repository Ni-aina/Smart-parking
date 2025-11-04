export function getDistanceTime(
  lat1: number | undefined,
  lon1: number | undefined,
  lat2: number | undefined,
  lon2: number | undefined,
  speedKmh: number = 50
) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return;

  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const timeHours = distanceKm / speedKmh;
  const timeMinutes = timeHours * 60;

  const hours = Math.floor(timeMinutes / 60);
  const minutes = Math.round(timeMinutes % 60);

  return {
    distanceKm,
    timeHours,
    timeMinutes,
    formatted: hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
  }
}
