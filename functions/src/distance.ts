import {GeoPoint} from "firebase-admin/firestore";

/**
 * Calculate the distance between two GeoPoints in meters.
 * @param {GeoPoint} from The starting point.
 * @param {GeoPoint} to The ending point.
 * @return {number} The distance between the two points in meters.
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 */
export function distance(from: GeoPoint, to: GeoPoint): number {
  const earthRadius = 6371e3;
  const latFromRad: number = from.latitude * Math.PI / 180;
  const latToRad: number = to.latitude * Math.PI / 180;
  const deltaLatRad: number = (to.latitude - from.latitude) * Math.PI / 180;
  const deltaLonRad: number = (to.longitude - from.longitude) * Math.PI / 180;

  const a: number = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
        Math.cos(latFromRad) * Math.cos(latToRad) *
        Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}
