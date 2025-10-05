// lib/nasaApi.ts
// 🌍 NASA Earthdata API integrations for Urban Heat & Water Stress

const CMR_BASE = "https://cmr.earthdata.nasa.gov/search/granules.json";

export interface SatelliteResult {
  id: string;
  title: string;
  time_start?: string;
  link?: string;
}

/**
 * 🔥 Fetch MODIS Land Surface Temperature (for Urban Heat Islands)
 * MOD11A1: MODIS Terra Land Surface Temperature Daily Global
 */
export async function fetchUrbanHeatData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<SatelliteResult[]> {
  const temporalValue = `${startDate}T00:00:00Z,${endDate}T23:59:59Z`;
  const boundingBoxValue = `${lon - 0.5},${lat - 0.5},${lon + 0.5},${lat + 0.5}`;
  
  const query = new URLSearchParams({
    short_name: "MOD11A1",
    temporal: temporalValue,
    bounding_box: boundingBoxValue,
    page_size: "10",
  });

  const res = await fetch(`${CMR_BASE}?${query}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`MODIS API error: ${res.status}`);
  const data = await res.json();
  return data.feed?.entry?.map((item: any) => ({
    id: item.id,
    title: item.title,
    time_start: item.time_start,
    link: item.links?.[0]?.href,
  })) || [];
}

/**
 * 💧 Fetch GRACE Water Storage data (for Water Stress / Drought)
 * Uses CSR GRACE mascon solutions
 */
export async function fetchWaterStressData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<SatelliteResult[]> {
  const temporalValue = `${startDate}T00:00:00Z,${endDate}T23:59:59Z`;
  const boundingBoxValue = `${lon - 0.5},${lat - 0.5},${lon + 0.5},${lat + 0.5}`;
  
  const query = new URLSearchParams({
    short_name: "GRACE_CSR_MASCON",
    temporal: temporalValue,
    bounding_box: boundingBoxValue,
    page_size: "10",
  });

  const res = await fetch(`${CMR_BASE}?${query}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`GRACE API error: ${res.status}`);
  const data = await res.json();
  return data.feed?.entry?.map((item: any) => ({
    id: item.id,
    title: item.title,
    time_start: item.time_start,
    link: item.links?.[0]?.href,
  })) || [];
}
